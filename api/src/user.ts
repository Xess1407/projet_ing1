import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import { log } from "console";

class UserController implements Controller {
  static path = "/user";
  router: Router;

  constructor() {
    this.router = new Router();
    this.router.post(UserController.path, this.post);
    this.router.post(UserController.path + "/connect", this.get);
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

  static async exist_user(id: number): bool {
    let res = false;
    await UserController.get_values().then((rows) =>
      rows.forEach((row) => {
        if ((row.rowid) == id) {
          res = true;
        }
      })
    );

    return res;
  }

  async get(req: Request, res: Response) {
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
    await UserController.get_values().then((rows) =>
      rows.forEach((row) => {
        if (row.email == email && row.password == password) {
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

  static async post_new(p: User, res: Response, id?: number) {
    let sql;
    let data;
    const db = new Database("maggle.db");
    const exist = await this.exist_email(p.email);
    if (exist) {
      res.status(400).send();
      return;
    }

    if (typeof id !== "undefined") {
      res.status(400).send();
      return;
    } else {
      sql = "INSERT INTO user VALUES(?,?,?,?,?,?)";
      data = [
        p.name,
        p.family_name,
        p.email,
        p.password,
        p.telephone_number,
        p.role
      ];
    }

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
      "[INFO][POST] data added on " + UserController.path + " : " +
        JSON.stringify(p),
    );
    res.status(200).send();
  }

  static async post_modify(p: UserEntry, res: Response) {
    const db = new Database("maggle.db");

    const exist = await this.exist_email(p.email);
    if (!exist) {
      res.status(400).send();
      return;
    }

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

  static async exist_email(email: string): bool {
    let res = false;
    await UserController.get_emails().then((rows) =>
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
}

export default UserController;

class User {
  name: string;
  family_name: string;
  email: string;
  password: string;
  telephone_number: number;
  role: string;

  constructor(
    name: string,
    family_name: string,
    email: string,
    password: string,
    telephone_number: number,
    role: string
  ) {
    this.name = name;
    this.family_name = family_name;
    this.email = email;
    this.password = password;
    this.telephone_number = telephone_number;
    this.role = role;
  }
}

class UserEntry {
  id: number;
  name: string;
  family_name: string;
  email: string;
  password: string;
  telephone_number: number;
  role: string;

  constructor(
    id: number,
    name: string,
    family_name: string,
    email: string,
    password: string,
    telephone_number: number,
    role: string,
  ) {
    this.id = id;
    this.name = name;
    this.family_name = family_name;
    this.email = email;
    this.password = password;
    this.telephone_number = telephone_number;
    this.role = role;
  }
}
