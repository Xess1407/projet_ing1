import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import { log } from "console";
import UserController from "./user";
import { User } from "./user_class";

class ManagerController implements Controller {
  static path = "/manager";
  router: Router;

  constructor() {
    this.router = Router();
    this.router.get(ManagerController.path, this.get_all);
    this.router.get(ManagerController.path + "/full", this.get_all_full);
    this.router.post(ManagerController.path, this.post);
    this.router.post(ManagerController.path + "/full", this.post_full)
    this.router.post(ManagerController.path + "/full/get", this.get_full)
    this.router.post(ManagerController.path + "/get", this.get);
    this.router.delete(ManagerController.path, this.delete);
  }

  static get_values() {
    const db = new Database("maggle.db");
    const sql = "SELECT rowid, * FROM manager";

    return new Promise((resolve, reject) =>
      db.all(sql, [], (err, rows) => {
        if (err) {
          console.log(err);
        }
        resolve(rows);
      })
    );
  }

  static async get_rowid(user_id: number) {
    let id = -1;
    await ManagerController.get_values().then((rows: any) =>
    rows.forEach((row) => {
        if (row.user_id == user_id) {
          id = row.user_id;
        }
      })
    )
    return id
  }

  static get_manager_by_user_id(user_id: number) {
    const db = new Database("maggle.db");
    const sql = "SELECT rowid, * FROM manager WHERE user_id = ?";

    let params = [user_id];

    return new Promise((resolve, reject) =>
      db.all(sql, params, (err, rows) => {
        if (err) {
          console.log(err);
        }
        resolve(rows);
      })
    );
  }

  static async is_activated(user_id: number): Promise<boolean> {
    let res = false;
    let existManager = await ManagerController.exist_manager(user_id);
    if(existManager) {
      await ManagerController.get_manager_by_user_id(user_id).then((rows: any) => {
        let man = rows[0];
        let now = new Date();
        let ac_date = new Date(man.activation_date);
        let deac_date = new Date(man.deactivation_date);
  
        res = (ac_date <= now) && (now <= deac_date);
      });
    }
    
    return res;
  }

  static async exist_manager(user_id: number) {
    let res = false;
    await ManagerController.get_manager_by_user_id(user_id).then((rows: any) => {
        if(rows.length > 0) {
        res = true;
        }
    });

    return res;
  }

  async get_all(req: Request, res: Response) {
    let r = new Array<ManagerEntry>;

    await ManagerController.get_values().then((rows: any) =>
        rows.forEach((row) => {
            r.push(new ManagerEntry(
                row.rowid,
                row.user_id,
                row.company,
                row.activation_date,
                row.deactivation_date
            ));
        })
    );

    console.log(
    "[INFO][GET] " + ManagerController.path + ": ",
    );
    res.send(JSON.stringify(r));
  }

  async get_all_full(req: Request, res: Response) {
    let r = new Array<ManagerFull>;

    await ManagerController.get_values().then(async(rows: any) =>
    {
      for (const row of rows) {
        const res_user = await fetch(`http://localhost:8080/api/user/` + row.user_id, {
            method: "GET",
            headers: {"Content-type": "application/json; charset=UTF-8"} 
          });
          if (await res_user.status != 200) {
            console.log (
              "[ERROR][GET] error on " + UserController.path + "/" + row.user_id + ": " +
                JSON.stringify(req.body),
            );
            res.status(400).send();
            return;
          }
          let res_user_json = await res_user.json();
          
          r.push(new ManagerFull(
              row.rowid,
              row.user_id,
              row.company,
              row.activation_date,
              row.deactivation_date,
              res_user_json.name,
              res_user_json.family_name,
              res_user_json.email,
              res_user_json.password,
              res_user_json.telephone_number,
              res_user_json.role
          ));
      }
    });

    console.log(
      "[INFO][GET] " + ManagerController.path + ": ",
    );
    res.send(JSON.stringify(r));
  }


  async get(req: Request, res: Response) {
    let { user_id, password } = req.body;

    let r;

    if (!password || !user_id) {
      console.log (
        "[ERROR][POST] wrong data on " + ManagerController.path + ": " +
          JSON.stringify(req.body),
      );
      res.status(400).send();
      return;
    }

    /* Identify the ID to the user */
    let identified = await UserController.identifyUser(user_id, password);

    let found = false;
    if (identified) {
      await ManagerController.get_values().then((rows: any) =>
        rows.forEach((row) => {
          if (row.user_id == user_id) {
            found = true;
            r = new ManagerEntry(
              row.rowid,
              row.user_id,
              row.company,
              row.activation_date,
              row.deactivation_date
            );
          }
        })
      );
    }

    if (found) {
      console.log(
        "[INFO][POST] " + ManagerController.path + ": " + user_id,
      );
      res.send(JSON.stringify(r));
    } else {
      res.status(400).send();
    }
  }

  async get_full(req: Request, res: Response) {
    let { email, password } = req.body;

    let r;

    if (!password || !email) {
      console.log (
        "[ERROR][POST] wrong data on " + ManagerController.path + "/full/get" + ": " +
          JSON.stringify(req.body),
      );
      res.status(400).send();
      return;
    }

    const res_user = await fetch(`http://localhost:8080/api/user/connect`, {
      method: "POST",
      body: JSON.stringify({"email": email, "password": password }),
      headers: {"Content-type": "application/json; charset=UTF-8"} 
    });
    if (await res_user.status != 200) {
      console.log (
        "[ERROR][POST] wrong data on " + ManagerController.path + "/full/get" + ": " +
          JSON.stringify(req.body),
      );
      res.status(400).send();
      return;
    }
    let res_user_json = await res_user.json()

    let found = false;
    await ManagerController.get_values().then((rows: any) =>
      rows.forEach((row) => {
        if (row.user_id == res_user_json.id) {
          found = true;
          r = new ManagerFull(
            row.rowid,
            row.user_id,
            row.company,
            row.activation_date,
            row.deactivation_date,
            res_user_json.name,
            res_user_json.family_name,
            res_user_json.email,
            res_user_json.password,
            res_user_json.telephone_number,
            res_user_json.role
            )
          }
        }
      )
    );

    if (found) {
      console.log(
        "[INFO][POST] " + ManagerController.path + ": " + res_user_json.id,
      );
      res.send(JSON.stringify(r));
    } else {
      res.status(400).send();
    }
  }

  static async post_new(p: Manager, res: Response) {
    let sql;
    let data;
    const db = new Database("maggle.db");

    const exist_manager_user = await UserController.exist_manager_user(p.user_id);
    if (!exist_manager_user) {
        res.status(400).send();
        return;
    }

    const exist = await this.exist_manager(p.user_id);
    if (exist) {
      res.status(400).send();
      return;
    }
    
    sql = "INSERT INTO manager VALUES(?,?,?,?)";
    data = [
      p.user_id,
      p.company,
      p.activation_date,
      p.deactivation_date
    ];

    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][POST] sql error " + ManagerController.path + " : " +
          JSON.stringify(p),
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();

    console.log(
      "[INFO][POST] data added on " + ManagerController.path + " : " +
        JSON.stringify(p),
    );
    res.status(200).send();
  }


  static async post_modify(p: ManagerEntry, res: Response) {
    const db = new Database("maggle.db");

    const exist = await this.exist_manager(p.user_id);
    if (!exist) {
      res.status(400).send();
      return;
    }

    const sql = `UPDATE manager SET
    user_id = ?, company = ?, activation_date = ?, deactivation_date = ?
    WHERE rowid = ?`;
    const data = [
      p.user_id,
      p.company,
      p.activation_date,
      p.deactivation_date,
      p.id
    ];

    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][POST] sql error " + ManagerController.path + " : " +
          JSON.stringify(p),
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();

    console.log(
      "[INFO][POST] data updated on " + ManagerController.path + " : " +
        JSON.stringify(p),
    );
    res.status(200).send();
  }

  async post_full(req: Request, res: Response) {
    let { id, user_id, name, family_name, email, password, telephone_number, role, company, activation_date, deactivation_date } = req.body;

    if (
      !name || !family_name || !email || !password || !telephone_number || !role || !company || !activation_date || !deactivation_date
    ) {
      console.log(
        "[ERROR][POST] wrong data on " + ManagerController.path + " : " +
          JSON.stringify(req.body),
      );
      res.status(400).send();
      return;
    }

    if (
      role != "manager"
    ) {
      console.log(
        "[ERROR][POST] Cannot post non-manager on " + ManagerController.path + "/full : " +
          JSON.stringify(req.body),
      );
      res.status(400).send();
      return;
    }

    if (!id && !user_id) {
      const manager_data: ManagerData = new ManagerData(
        company,
        activation_date,
        deactivation_date
      );
      const user: User = new User(
        name,
        family_name,
        email,
        password,
        telephone_number,
        role
      )
      ManagerController.post_full_new(manager_data, user, res);
    } else {
      const manager_full: ManagerFull = new ManagerFull(
        id,
        user_id,
        company,
        activation_date,
        deactivation_date,
        name,
        family_name,
        email,
        password,
        telephone_number,
        role
      );
      ManagerController.post_full_modify(manager_full, res);
    }

    
  }

  static async post_full_new(p: ManagerData, u: User, res: Response) { 
    // Création du User avec fetch
    let res_user = await fetch(`http://localhost:8080/api/user`, {
      method: "POST",
      body: JSON.stringify({"name": u.name,
                            "family_name": u.family_name,
                            "email": u.email,
                            "password": u.password,
                            "telephone_number": u.telephone_number,
                            "role": u.role}),
      headers: {"Content-type": "application/json; charset=UTF-8"} 
    });
    if (await res_user.status != 200) {
      console.log(
        "[ERROR][POST] wrong data on " + ManagerController.path  + "/full" + " : " +
          JSON.stringify(u),
      );
      res.status(400).send();
      return;
    }
    let user_id = await res_user.json()

    // Création du Manager
    let sql;
    let data;
    const db = new Database("maggle.db");
    
    sql = "INSERT INTO manager VALUES(?,?,?,?)";
    data = [
      user_id.id,
      p.company,
      p.activation_date,
      p.deactivation_date
    ];

    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][POST] sql error " + ManagerController.path + " : " +
        JSON.stringify({"user_id": user_id.id, "company": p.company, "activation_date": p.activation_date, "deactivation_date": p.deactivation_date}),
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();

    console.log(
      "[INFO][POST] data added on " + ManagerController.path + " : " +
      JSON.stringify({"user_id": user_id.id, "company": p.company, "activation_date": p.activation_date, "deactivation_date": p.deactivation_date}),
    );
    res.status(200).send();
  }

  static async post_full_modify(m: ManagerFull, res: Response) { 
    const db = new Database("maggle.db");

    const exist = await UserController.exist_user_id(m.user_id);
    if (!exist) {
      res.status(400).send("[POST][MODIFY]User doesn't exist!");
      return;
    }

    // Update du User avec fetch
    let res_user = await fetch(`http://localhost:8080/api/user`, {
      method: "POST",
      body: JSON.stringify({"id": m.user_id,
                            "name": m.name,
                            "family_name": m.family_name,
                            "email": m.email,
                            "password": m.password,
                            "telephone_number": m.telephone_number,
                            "role": m.role}),
      headers: {"Content-type": "application/json; charset=UTF-8"} 
    });
    if (await res_user.status != 200) {
      console.log(
        "[ERROR][POST][MODIFY] wrong data on " + ManagerController.path  + "/full" + " : " + 
        JSON.stringify(m),
      );
      res.status(400).send();
      return;
    }

    // Update du Manager
    const sql = `UPDATE manager SET
    user_id = ?, company = ?, activation_date = ?, deactivation_date = ?
    WHERE rowid = ?`;
    const data = [
      m.user_id,
      m.company,
      m.activation_date,
      m.deactivation_date,
      m.id
    ];

    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][POST] sql error " + ManagerController.path + " : " +
          JSON.stringify({"user_id": m.user_id, "company": m.company, "activation_date": m.activation_date, "deactivation_date": m.deactivation_date}),
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();

    console.log(
      "[INFO][POST] data updated on " + ManagerController.path + " : " +
      JSON.stringify({"user_id": m.user_id, "company": m.company, "activation_date": m.activation_date, "deactivation_date": m.deactivation_date}),
    );
    res.status(200).send();
  }

  async delete(req: Request, res: Response) {
    const db = new Database("maggle.db");
    const { id, user_id, password } = req.body;

    if ( !id || !user_id || !password ) {
      console.log(
        "[ERROR][DELETE] wrong data on " + ManagerController.path + " : " +
          JSON.stringify(req.body),
      );
      res.status(400).send();
      return;
    }

    /* Check identifiers */
    let identified = await UserController.identifyManager(user_id, password) || await UserController.identifyAdmin(password);
    if (!identified) {
      res.status(401).send("Wrong password!");
      return;
    }

    const sql = `DELETE FROM manager
    WHERE rowid = ?`;
    const data = [id];

    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][DELETE] sql error " + ManagerController.path + " : " +
          JSON.stringify(id),
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();

    console.log(
      "[INFO][DELETE] data deleted on " + ManagerController.path + " : " +
        JSON.stringify(id),
    );
    res.status(200).send();
  }

  async post(req: Request, res: Response) {
    let { id, user_id, company, activation_date, deactivation_date } = req.body;
    if (
      !user_id || !company || !activation_date || !deactivation_date
    ) {
      console.log(
        "[ERROR][POST] wrong data on " + ManagerController.path + " : " +
          JSON.stringify(req.body),
      );
      res.status(400).send();
      return;
    }
    /* No ID implie creating the user otherwise modify it */
    if (!id) {
      const element: Manager = new Manager(
        user_id,
        company,
        activation_date,
        deactivation_date
      );
      ManagerController.post_new(element, res);
    } else {
      const element: ManagerEntry = new ManagerEntry(
        id,
        user_id,
        company,
        activation_date,
        deactivation_date
      );
      ManagerController.post_modify(element, res);
    }
  }
}

export default ManagerController;

class ManagerData {
  company: string;
  activation_date: Date;
  deactivation_date: Date;

  constructor(
      company: string,
      activation_date: Date,
      deactivation_date: Date
  ) {
      this.company = company;
      this.activation_date = activation_date;
      this.deactivation_date = deactivation_date;
  }
}

class Manager {
    user_id: number;
    company: string;
    activation_date: Date;
    deactivation_date: Date;

    constructor(
        user_id: number,
        company: string,
        activation_date: Date,
        deactivation_date: Date
    ) {
        this.user_id = user_id;
        this.company = company;
        this.activation_date = activation_date;
        this.deactivation_date = deactivation_date;
    }
}

class ManagerEntry {
    id: number;
    user_id: number;
    company: string;
    activation_date: Date;
    deactivation_date: Date;

    constructor(
        id: number,
        user_id: number,
        company: string,
        activation_date: Date,
        deactivation_date: Date
    ) {
        this.id = id;
        this.user_id = user_id;
        this.company = company;
        this.activation_date = activation_date;
        this.deactivation_date = deactivation_date;
    }
}

class ManagerFull extends User {
  id: number;
  user_id: number;
  company: string;
  activation_date: Date;
  deactivation_date: Date;

  constructor(
      id: number,
      user_id: number,
      company: string,
      activation_date: Date,
      deactivation_date: Date,
      name: string,
      family_name: string,
      email: string,
      password: string,
      telephone_number: number,
      role: string
  ) {
      super(name, family_name, email, password, telephone_number, role)
      this.id = id;
      this.user_id = user_id;
      this.company = company;
      this.activation_date = activation_date;
      this.deactivation_date = deactivation_date;
  }
}