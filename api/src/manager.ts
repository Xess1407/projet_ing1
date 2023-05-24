import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import { log } from "console";
import UserController, { User } from "./user";

class ManagerController implements Controller {
  static path = "/manager";
  router: Router;

  constructor() {
    this.router = Router();
    this.router.post(ManagerController.path, this.post);
    this.router.post(ManagerController.path + "/full", this.post_full)
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

  static async exist_manager(user_id: number) {
    let res = false;
    await ManagerController.get_manager_by_user_id(user_id).then((rows: any) => {
        if(rows.length > 0) {
        res = true;
        }
    });

    return res;
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
    let { name, family_name, email, password, telephone_number, role, company, activation_date, deactivation_date } = req.body;

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

    let res_user;
    await UserController.post_new(new User(name, family_name, email, password, telephone_number, role), res_user)
    if (await res_user.status != 200) {
      console.log(
        "[ERROR][POST] wrong data on " + ManagerController.path  + "/full" + " : " +
          JSON.stringify(req.body),
      );
      res.status(400).send();
      return;
    }
    let user_id = await res_user.json()

    let sql;
    let data;
    const db = new Database("maggle.db");
    
    sql = "INSERT INTO manager VALUES(?,?,?,?)";
    data = [
      user_id.id,
      company,
      activation_date,
      deactivation_date
    ];

    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][POST] sql error " + ManagerController.path + " : " +
          JSON.stringify(data),
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();

    console.log(
      "[INFO][POST] data added on " + ManagerController.path + " : " +
        JSON.stringify(data),
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
    let identified = await UserController.identifyManager(user_id, password);
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
}

export default ManagerController;

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
