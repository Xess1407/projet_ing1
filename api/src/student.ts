import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import UserController from "./user";
import { log } from "console";

class StudentController implements Controller {
  static path = "/student";
  router: Router;

  constructor() {
    this.router = new Router();
    this.router.post(StudentController.path, this.post);
    this.router.post(StudentController.path + "/get", this.get);
  }

  static get_values() {
    const db = new Database("maggle.db");
    const sql = "SELECT rowid, * FROM student";

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
    await StudentController.get_values().then((rows: any) =>
    rows.forEach((row) => {
        if (row.user_id == user_id) {
          id = row.user_id;
        }
      })
    )
    return id
  }

  static get_student_by_user_id(user_id: number) {
    const db = new Database("maggle.db");
    const sql = "SELECT rowid, * FROM student WHERE user_id = ?";

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

  static async exist_student(user_id: number): Promise<boolean> {
    let res = false;
    await StudentController.get_student_by_user_id(user_id).then((rows: any) => {
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
      console.log(
        "[ERROR][POST] wrong data on " + StudentController.path + "/get: " +
          JSON.stringify(req.body),
      );
      res.status(400).send();
      return;
    }

    /* Identify the ID to the user */
    let identified = false;
    await UserController.get_values().then((rows: any) =>
    rows.forEach((row) => {
        if (row.rowid == user_id && row.password == password) {
          identified = true;
        }
      })
    )

    let found = false;
    if (identified) {
      await StudentController.get_values().then((rows: any) =>
        rows.forEach((row) => {
          if (row.user_id == user_id) {
            found = true;
            r = new StudentEntry(
              row.rowid,
              row.user_id,
              row.school_level,
              row.school,
              row.city
            );
          }
        })
      );
    }

    if (found) {
      console.log(
        "[INFO][POST] " + StudentController.path + ": " + user_id,
      );
      res.send(JSON.stringify(r));
    } else {
      res.status(400).send();
    }
  }

  static async post_new(p: Student, res: Response) {
    let sql;
    let data;
    const db = new Database("maggle.db");

    const exist_user = await UserController.exist_student_user(p.user_id);
    if (!exist_user) {
      res.status(400).send("[POST][NEW] User doesn't exist!");
      return;
    }

    const exist_student = await this.exist_student(p.user_id)
    if (exist_student) {
      res.status(400).send("[POST][NEW] Student already exist!");
      return;
    }
    
    /* Define query */
    sql = "INSERT INTO student VALUES(?,?,?,?)";
    data = [
      p.user_id,
      p.school_level,
      p.school,
      p.city
    ];
    
    /* Run query */
    let e;
    db.run(sql, data, function (err) {
      if (err) {
        console.log(
          "[ERROR][POST] sql error " + StudentController.path + " : " +
            JSON.stringify(p),
        );
        console.error(e.message);
        res.status(500).send();
        return;
      }

      console.log(
        "[INFO][POST] data added on " + StudentController.path + " : " +
          JSON.stringify(p),
      );
  
      res.status(200).send(JSON.stringify({"id:":this.lastID}));
    });
    db.close();
  }

  static async post_modify(p: StudentEntry, res: Response) {
    const db = new Database("maggle.db");

    const exist = await UserController.exist_user_id(p.user_id);
    if (!exist) {
      res.status(400).send("[POST][MODIFY]User doesn't exist!");
      return;
    }

    const sql = `UPDATE student SET
    user_id = ?, school_level = ?, school = ?, city = ?
    WHERE rowid = ?`;
    const data = [
      p.user_id,
      p.school_level,
      p.school,
      p.city,
      p.id
    ];

    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][POST] sql error " + StudentController.path + " : " +
          JSON.stringify(p),
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();

    console.log(
      "[INFO][POST] data updated on " + StudentController.path + " : " +
        JSON.stringify(p),
    );
    res.status(200).send();
  }

  async post(req: Request, res: Response) {
    let { id, user_id, school_level, school, city, password } = req.body;

    if (!user_id || !school_level || !school || !city || !password) {
      console.log(
        "[ERROR][POST] wrong data on " + StudentController.path + " : " +
          JSON.stringify(req.body),
      );
      res.status(400).send();
      return;
    }

    /* Check identifiers */

    /* No ID of student implie creating the user otherwise modify it */
    if (!id) {
      const element: Student = new Student(
        user_id,
        school_level,
        school,
        city
      );
      StudentController.post_new(element, res);
    } else {
      /* Get the rowid of the student with the password */
      const element: StudentEntry = new StudentEntry(
        id,
        user_id,
        school_level,
        school,
        city
      );
      StudentController.post_modify(element, res);
    }
  }
}

export default StudentController;

class Student {
  user_id: number;
  school_level: string;
  school: string;
  city: string;

  constructor(
    user_id: number,
    school_level: string,
    school: string,
    city: string
  ) {
    this.user_id = user_id;
    this.school_level = school_level;
    this.school = school;
    this.city = city;
  }
}

class StudentEntry {
  id: number;
  user_id: number;
  school_level: string;
  school: string;
  city: string;

  constructor(
    id: number,
    user_id: number,
    school_level: string,
    school: string,
    city: string
  ) {
    this.id = id;
    this.user_id = user_id;
    this.school_level = school_level;
    this.school = school;
    this.city = city;
  }
}
