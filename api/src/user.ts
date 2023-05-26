import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import Bcrypt from 'bcrypt';
import { User, UserEntry } from "./user_class";
import StudentController from "./student";
import ManagerController from "./manager";

class UserController implements Controller {
  static path = "/user";
  router: Router;

  constructor() {
    this.router = Router();
    this.router.post(UserController.path, this.post);
    this.router.get(UserController.path + "/:id", this.get);
    this.router.post(UserController.path + "/connect", this.connect);
    this.router.delete(UserController.path, this.delete);
  }

  static get_values() {
    const db = new Database("maggle.db");
    const sql = "SELECT rowid, * FROM user";

    return new Promise((resolve, reject) =>
      db.all(sql, [], (err, rows) => {
        if (err) {
          console.log(err);
        }
        resolve(rows);
      })
    );
  }

  static get_emails() {
    const db = new Database("maggle.db");
    const sql = "SELECT email FROM user";

    return new Promise((resolve, reject) =>
      db.all(sql, [], (err, rows) => {
        if (err) {
          console.log(err);
        }
        resolve(rows);
      })
    );
  }

  static async identifyStudent(user_id: number, password: string) {
    let res = false;
    await UserController.get_values().then((rows: any) =>
      rows.forEach((row) => {
        if (row.role == "student" && row.rowid == user_id) { 
          const match = Bcrypt.compareSync(password, row.password);
          if(match || password == row.password) {
              res = true;
          }
        }
      })
    );

    return res;
  }

  static async identifyAdmin(password: string) {
    let res = false;
    await UserController.get_values().then((rows: any) =>
      rows.forEach((row) => {
        if (row.role == "admin") { 
          const match = Bcrypt.compareSync(password, row.password);
          if(match || password == row.password) {
              res = true;
          }
        }
      })
    );

    return res;
  }

  static async identifyManager(user_id: number, password: string) {
    let res = false;
    await UserController.get_values().then((rows: any) =>
      rows.forEach((row) => {
        if (row.role == "manager" && row.rowid == user_id) { 
          const match = Bcrypt.compareSync(password, row.password);
          if(match || password == row.password) {
              res = true;
          }
        }
      })
    );

    return res;
  }

  static async identifyUser(user_id: number, password: string) {
    let res = false;
    await UserController.get_values().then((rows: any) =>
      rows.forEach((row) => {
        if (row.rowid == user_id) { 
          const match = Bcrypt.compareSync(password, row.password);
          if(match || password == row.password) {
              res = true;
          }
        }
      })
    );

    return res;
  }

  static async exist_user_id(user_id: number) {
    let res = false;
    await UserController.get_values().then((rows: any) =>
      rows.forEach((row) => {
        if (row.rowid == user_id) {
          res = true;
        }
      })
    );

    return res;
  }

  static async exist_student_user(user_id: number) {
    let res = false;
    await UserController.get_values().then((rows: any) =>
      rows.forEach((row) => {
        if (row.rowid == user_id && row.role == "student") {
          res = true;
        }
      })
    );

    return res;
  }

  static async exist_manager_user(id: number) {
    let res = false;
    await UserController.get_values().then((rows: any) =>
      rows.forEach((row) => {
        if (row.rowid == id && row.role == "manager") {
          res = true;
        }
      })
    );

    return res;
  }

  async get(req: Request, res: Response) {
    let id = req.params.id
    let r;
    
    let found = false;
    await UserController.get_values().then((rows: any) =>
        rows.forEach((row) => {
            if (row.rowid == id) {
                found = true;
                r = new UserEntry(
                    row.rowid,
                    row.name,
                    row.family_name,
                    row.email,
                    row.password,
                    row.telephone_number,
                    row.role
                );
            }
        })
    )
    
    if (found) {
        console.log(
          "[INFO][GET] " + UserController.path + "/" + id + ": ",
        );
        res.send(JSON.stringify(r));
    } else {
        res.status(400).send();
    }
}

  async connect(req: Request, res: Response) {
    let { email, password } = req.body;

    let r;

    if (!password || !email) {
      console.log(
        "[ERROR][POST] wrong data on " + UserController.path + "/connect : " +
          JSON.stringify(req.body),
      );
      res.status(400).send();
      return;
    }

    let found = false;
    await UserController.get_values().then((rows: any) =>
      rows.forEach((row) => {
        if (row.email == email && (Bcrypt.compareSync(password, row.password) || password == row.password)) {
          found = true;
          r = new UserEntry(
            row.rowid,
            row.name,
            row.family_name,
            row.email,
            row.password,
            row.telephone_number,
            row.role
          );
        }
      })
    );

    if (found) {
      console.log(
        "[INFO][POST] " + UserController.path + "/connect " + email,
      );
      res.send(JSON.stringify(r));
    } else {
      res.status(400).send();
    }
  }

  static async post_new(p: User, res: Response) {
    let sql;
    let data;
    const db = new Database("maggle.db");
    const exist = await this.exist_email(p.email);
    if (exist) {
      res.status(400).send();
      return;
    }

    // Hash password
    p.password =  Bcrypt.hashSync(p.password, 10);

    sql = "INSERT INTO user VALUES(?,?,?,?,?,?)";
    data = [
      p.name,
      p.family_name,
      p.email,
      p.password,
      p.telephone_number,
      p.role
    ];

    /* Run query */
    db.run(sql, data, function (err) {
      if (err) {
        console.log(
          "[ERROR][POST] sql error " + UserController.path + " : " +
            JSON.stringify(p),
        );
        console.error(err.message);
        res.status(500).send();
        return;
      }

      console.log(
        "[INFO][POST] data added on " + UserController.path + " : " +
          JSON.stringify(p),
      );
  
      res.status(200).send(JSON.stringify({"id":this.lastID}));
    });
    db.close();
  }

  static async post_modify(p: UserEntry, res: Response) {
    const db = new Database("maggle.db");

    const exist = await this.exist_email(p.email);
    if (!exist) {
      res.status(400).send();
      return;
    }

    // Hash password
    p.password =  Bcrypt.hashSync(p.password, 10);

    const sql = `UPDATE user SET
    name = ?, family_name = ?, email = ?, password = ?, telephone_number = ?, role = ?
    WHERE rowid = ?`;
    const data = [
      p.name,
      p.family_name,
      p.email,
      p.password,
      p.telephone_number,
      p.role,
      p.id,
    ];

    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][POST] sql error " + UserController.path + " : " +
          JSON.stringify(p),
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();

    console.log(
      "[INFO][POST] data updated on " + UserController.path + " : " +
        JSON.stringify(p),
    );
    res.status(200).send();
  }

  static async exist_email(email: string) {
    let res = false;
    await UserController.get_emails().then((rows: any) =>
      rows.forEach((row) => {
        if ((row.email) == email) {
          res = true;
        }
      })
    );

    return res;
  }

  async post(req: Request, res: Response) {
    let { id, name, family_name, email, password, telephone_number , role } = req.body;

    if (
      !name || !family_name || !email || !password || !role
    ) {
      console.log(
        "[ERROR][POST] wrong data on " + UserController.path + " : " +
          JSON.stringify(req.body),
      );
      res.status(400).send();
      return;
    }

    if (!telephone_number) {
      telephone_number = "";
    }

    /* No ID implie creating the user otherwise modify it */
    if (!id) {
      const element: User = new User(
        name,
        family_name,
        email,
        password,
        telephone_number,
        role
      );
      UserController.post_new(element, res);
    } else {
      const element: UserEntry = new UserEntry(
        id,
        name,
        family_name,
        email,
        password,
        telephone_number,
        role
      );
      UserController.post_modify(element, res);
    }
  }

  async delete(req: Request, res: Response) {
    const db = new Database("maggle.db");
    const { id, password } = req.body;

    if ( !id || !password ) {
      console.log(
        "[ERROR][DELETE] wrong data on " + UserController.path + " : " +
          JSON.stringify(req.body),
      );
      res.status(400).send();
      return;
    }

    /* Check identifiers */
    let identified = await UserController.identifyUser(id, password);
    if (!identified) {
      res.status(401).send("Wrong password!");
      return;
    }

    let is_student = await UserController.identifyStudent(id, password);
    let is_manager = await UserController.identifyManager(id, password);

    // On delete en cascade le User ou le Manager associé s'il y en a
    if(is_student) {
      // Suppression du Student
      let row_id = await StudentController.get_rowid(id);

      const sql = `DELETE FROM student
      WHERE rowid = ?`;
      const data = [row_id];

      let e;
      db.run(sql, data, (err) => e = err);
      if (e) {
        console.log(
          "[ERROR][DELETE] sql error " + StudentController.path + " : " +
            JSON.stringify(row_id),
        );
        console.error(e.message);
        res.status(500).send();
        return;
      }

      console.log(
        "[INFO][DELETE] data deleted on " + StudentController.path + " : " +
          JSON.stringify(row_id),
      );
    } else if(is_manager) {
      // Suppression du Manager
      let row_id = await ManagerController.get_rowid(id);

      const sql = `DELETE FROM manager
      WHERE rowid = ?`;
      const data = [row_id];

      let e;
      db.run(sql, data, (err) => e = err);
      if (e) {
        console.log(
          "[ERROR][DELETE] sql error " + ManagerController.path + " : " +
            JSON.stringify(row_id),
        );
        console.error(e.message);
        res.status(500).send();
        return;
      }

      console.log(
        "[INFO][DELETE] data deleted on " + ManagerController.path + " : " +
          JSON.stringify(row_id),
      );
    }

    // On supprime le User
    const sql = `DELETE FROM user
    WHERE rowid = ?`;
    const data = [id];

    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][DELETE] sql error " + UserController.path + " : " +
          JSON.stringify(id),
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }

    console.log(
      "[INFO][DELETE] data deleted on " + UserController.path + " : " +
        JSON.stringify(id),
    );

    db.close();

    res.status(200).send();
  }
}

export default UserController;