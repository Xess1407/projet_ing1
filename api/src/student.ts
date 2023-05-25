import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import UserController, { User } from "./user";
import { log } from "console";

class StudentController implements Controller {
  static path = "/student";
  router: Router;

  constructor() {
    this.router = Router();
    this.router.post(StudentController.path, this.post);
    this.router.post(StudentController.path + "/full", this.post_full);
    this.router.post(StudentController.path + "/full/get", this.get_full);
    this.router.post(StudentController.path + "/get", this.get);
    this.router.delete(StudentController.path, this.delete);
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
    let identified = await UserController.identifyUser(user_id, password);

    if (!identified) {
      res.status(401).send("Wrong password!");
      return;
    }

    let found = false;
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

    if (found) {
      console.log(
        "[INFO][POST] " + StudentController.path + ": " + user_id,
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
        "[ERROR][POST] wrong data on " + StudentController.path + "/full/get" + ": " +
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
        "[ERROR][POST] wrong data on " + StudentController.path + "/full/get" + ": " +
          JSON.stringify(req.body),
      );
      res.status(400).send();
      return;
    }
    let res_user_json = await res_user.json();

    let found = false;
    await StudentController.get_values().then((rows: any) =>
      rows.forEach((row) => {
        if (row.user_id == res_user_json.id) {
          found = true;
          r = new StudentFull(
            row.rowid,
            row.user_id,
            row.school_level,
            row.school,
            row.city,
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
        "[INFO][POST] " + StudentController.path + ": " + res_user_json.id,
      );
      res.send(JSON.stringify(r));
    } else {
      res.status(400).send();
    }
  }

  async post_full(req: Request, res: Response) {
    let { id, user_id, name, family_name, email, password, telephone_number, role, school_level, school, city } = req.body;

    if (
      !name || !family_name || !email || !password || !telephone_number || !role || !school_level || !school || !city
    ) {
      console.log(
        "[ERROR][POST] ratio wrong data on " + StudentController.path + "/full : " +
          JSON.stringify(req.body),
      );
      res.status(400).send();
      return;
    }

    if (
      role != "student"
    ) {
      console.log(
        "[ERROR][POST] Cannot post non-student on " + StudentController.path + "/full : " +
          JSON.stringify(req.body),
      );
      res.status(400).send();
      return;
    }

    if (!id && !user_id) {
      const student_data: StudentData = new StudentData(
        school_level,
        school,
        city
      );
      const user: User = new User(
        name,
        family_name,
        email,
        password,
        telephone_number,
        role
      )
      StudentController.post_full_new(student_data, user, res);
    } else {
      const student_full: StudentFull = new StudentFull(
        id,
        user_id,
        school_level,
        school,
        city,
        name,
        family_name,
        email,
        password,
        telephone_number,
        role
      );
      StudentController.post_full_modify(student_full, res);
    }
  }

  static async post_full_new(p: StudentData, u: User, res: Response) { 
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
        "[ERROR][POST] wrong data on " + StudentController.path  + "/full" + " : " +
        JSON.stringify(u),
      );
      res.status(400).send();
      return;
    }

    let user_id = await res_user.json();

    // Création du Student
    let sql;
    let data;
    const db = new Database("maggle.db");
    
    sql = "INSERT INTO student VALUES(?,?,?,?)";
    data = [
      user_id.id,
      p.school_level,
      p.school,
      p.city
    ];

    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][POST] sql error " + StudentController.path + " : " +
          JSON.stringify({"user_id": user_id.id, "school_level": p.school_level, "school": p.school, "city": p.city}),
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();

    console.log(
      "[INFO][POST] data added on " + StudentController.path + " : " +
      JSON.stringify({"user_id": user_id.id, "school_level": p.school_level, "school": p.school, "city": p.city}),
    );
    res.status(200).send();
  }

  static async post_full_modify(s: StudentFull, res: Response) { 
    const db = new Database("maggle.db");

    const exist = await UserController.exist_user_id(s.user_id);
    if (!exist) {
      res.status(400).send("[POST][MODIFY]User doesn't exist!");
      return;
    }

    // Update du User avec fetch
    let res_user = await fetch(`http://localhost:8080/api/user`, {
      method: "POST",
      body: JSON.stringify({"id": s.user_id,
                            "name": s.name,
                            "family_name": s.family_name,
                            "email": s.email,
                            "password": s.password,
                            "telephone_number": s.telephone_number,
                            "role": s.role}),
      headers: {"Content-type": "application/json; charset=UTF-8"} 
    });
    if (await res_user.status != 200) {
      console.log(
        "[ERROR][POST][MODIFY] wrong data on " + StudentController.path  + "/full" + " : " + 
        JSON.stringify(s),
      );
      res.status(400).send();
      return;
    }

    // Update du Student
    const sql = `UPDATE student SET
    user_id = ?, school_level = ?, school = ?, city = ?
    WHERE rowid = ?`;
    const data = [
      s.user_id,
      s.school_level,
      s.school,
      s.city,
      s.id
    ];

    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][POST] sql error " + StudentController.path + " : " +
        JSON.stringify({"user_id": s.user_id, "school_level": s.school_level, "school": s.school, "city": s.city}),
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();

    console.log(
      "[INFO][POST] data updated on " + StudentController.path + " : " +
        JSON.stringify({"user_id": s.user_id, "school_level": s.school_level, "school": s.school, "city": s.city}),
    );
    res.status(200).send();
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
    db.run(sql, data, function (err) {
      if (err) {
        console.log(
          "[ERROR][POST] sql error " + StudentController.path + " : " +
            JSON.stringify(p),
        );
        console.error(err.message);
        res.status(500).send();
        return;
      }

      console.log(
        "[INFO][POST] data added on " + StudentController.path + " : " +
          JSON.stringify(p),
      );
  
      res.status(200).send(JSON.stringify({"id":this.lastID}));
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
    let identified = await UserController.identifyUser(user_id, password);
    if (!identified) {
      res.status(401).send("Wrong password!");
      return;
    }

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

  async delete(req: Request, res: Response) {
    const db = new Database("maggle.db");
    const { id, user_id, password } = req.body;

    if (!id || !user_id || !password ) {
      console.log(
        "[ERROR][DELETE] wrong data on " + StudentController.path + " : " +
          JSON.stringify(req.body),
      );
      res.status(400).send();
      return;
    }

    /* Check identifiers */
    let identified = await UserController.identifyStudent(user_id, password);
    if (!identified) {
      res.status(401).send("Wrong password!");
      return;
    }
    

    const sql = `DELETE FROM student
    WHERE rowid = ?`;
    const data = [id];

    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][DELETE] sql error " + StudentController.path + " : " +
          JSON.stringify(id),
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();

    console.log(
      "[INFO][DELETE] data deleted on " + StudentController.path + " : " +
        JSON.stringify(id),
    );
    res.status(200).send();
  }
}

export default StudentController;

class StudentData {
  school_level: string;
  school: string;
  city: string;

  constructor(
      school_level: string,
      school: string,
      city: string
  ) {
      this.school_level = school_level;
      this.school = school;
      this.city = city;
  }
}

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

class StudentFull extends User {
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
      city: string,
      name: string,
      family_name: string,
      email: string,
      password: string,
      telephone_number: number,
      role: string
  ) {
      super(name, family_name, email, password, telephone_number, role);
      this.id = id;
      this.user_id = user_id;
      this.school_level = school_level;
      this.school = school;
      this.city = city;
  }
}