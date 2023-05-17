import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import { log } from "console";
import UserController from "./user";

class ManagerController implements Controller {
  static path = "/manager";
  router: Router;

  constructor() {
    this.router = new Router();
    this.router.post(ManagerController.path, this.post);
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
      db.all(sql, [], (err, rows) => {
        if (err) {
          console.log(err);
        }
        resolve(rows);
      })
    );
  }

  static async exist_manager(user_id: number): bool {
    let res = false;
    await ManagerController.get_manager_by_user_id(user_id).then((rows) => {
        if(rows.length > 0) {
        res = true;
        }
    });

    return res;
  }

  static async post_new(p: Manager, res: Response, id?: number) {
    let sql;
    let data;
    const db = new Database("maggle.db");

    const existManagerUser = await UserController.exist_manager_user(p.user_id);
    if (!existManagerUser) {
        res.status(400).send();
        return;
    }

    const exist = await this.exist_manager(p.user_id);
    if (exist) {
      res.status(400).send();
      return;
    }
    

    if (typeof id !== "undefined") {
      res.status(400).send();
      return;
    } else {
      sql = "INSERT INTO manager VALUES(?,?,?,?)";
      data = [
        p.user_id,
        p.company,
        p.activationDate,
        p.deactivationDate
      ];
    }

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
    company = ?, activationDate = ?, deactivationDate = ?
    WHERE rowid = ?`;
    const data = [
      p.company,
      p.activationDate,
      p.deactivationDate,
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

  async post(req: Request, res: Response) {
    let { id, user_id, company, activationDate, deactivationDate } = req.body;

    if (
      !user_id || !company || !activationDate || !deactivationDate
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
        activationDate,
        deactivationDate
      );
      ManagerController.post_new(element, res);
    } else {
      const element: ManagerEntry = new ManagerEntry(
        id,
        user_id,
        company,
        activationDate,
        deactivationDate
      );
      ManagerController.post_modify(element, res);
    }
  }
}

export default ManagerController;

class Manager {
    user_id: number;
    company: string;
    activationDate: Date;
    deactivationDate: Date;

    constructor(
        user_id: number,
        company: string,
        activationDate: Date,
        deactivationDate: Date
    ) {
        this.user_id = user_id;
        this.company = company;
        this.activationDate = activationDate;
        this.deactivationDate = deactivationDate;
    }
}

class ManagerEntry {
    id: number;
    user_id: number;
    company: string;
    activationDate: Date;
    deactivationDate: Date;

    constructor(
        id: number,
        user_id: number,
        company: string,
        activationDate: Date,
        deactivationDate: Date
    ) {
        this.id = id;
        this.user_id = user_id;
        this.company = company;
        this.activationDate = activationDate;
        this.deactivationDate = deactivationDate;
    }
}
