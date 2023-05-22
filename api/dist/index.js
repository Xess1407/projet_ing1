var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_cors = __toESM(require("cors"));
var import_express = __toESM(require("express"));
var bodyParser = __toESM(require("body-parser"));
var App = class {
  constructor(controllers2, port) {
    this.app = (0, import_express.default)();
    this.port = port;
    this.controllers = controllers2;
    this.app.get("/ping", (_req, res) => res.send("PONG !"));
    this.initializeMiddlewares();
    this.initializeControllers(this.controllers);
  }
  initializeMiddlewares() {
    this.app.use((0, import_cors.default)());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use("/files", import_express.default.static("files"));
  }
  initializeControllers(controllers2) {
    controllers2.forEach((controller) => {
      this.app.use("/api", controller.router);
    });
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log(`[INFO] MAGGLE API started on port ${this.port}`);
      this.app.use("/", import_express.default.static("../front/dist/"));
      this.app.get("*", function(_req, res) {
        res.redirect("/");
      });
    });
  }
};
var app_default = App;

// src/file.ts
var import_multer = __toESM(require("multer"));
var fs = __toESM(require("fs"));
var import_express2 = require("express");
var sharp = require("sharp");
var storageEngine = import_multer.default.diskStorage({
  destination: "./files/",
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  }
});
var upload = (0, import_multer.default)({
  limits: { fileSize: 1e6 },
  storage: storageEngine
});
var uploadFiles = async (req, res) => {
  try {
    await sharp(`./files/${req.file.originalname}`).resize({ width: 250, height: 250 }).png().toFile(`./files/m${req.file.originalname}`);
    fs.rm(`./files/${req.file.originalname}`, (err) => {
      if (err)
        console.error(err.message);
    });
    res.status(201).send("Image uploaded succesfully");
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
var _FileController = class {
  constructor() {
    this.router = new import_express2.Router();
    this.router.get(_FileController.path + "/:name", this.download);
    this.router.post(
      _FileController.path,
      upload.single("file"),
      uploadFiles
    );
  }
  download(req, res) {
    const fileName = req.params.name;
    const directoryPath = "files/";
    res.download(directoryPath + fileName, fileName, (err) => {
      console.log("[INFO][GET] file : " + fileName);
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err
        });
      }
    });
  }
};
var FileController = _FileController;
FileController.path = "/file";
var file_default = FileController;

// src/manager.ts
var import_express4 = require("express");
var import_sqlite32 = require("sqlite3");

// src/user.ts
var import_express3 = require("express");
var import_sqlite3 = require("sqlite3");
var _UserController = class {
  constructor() {
    this.router = new import_express3.Router();
    this.router.post(_UserController.path, this.post);
    this.router.post(_UserController.path + "/connect", this.get);
  }
  static get_values() {
    const db = new import_sqlite3.Database("maggle.db");
    const sql = "SELECT rowid, * FROM user";
    return new Promise(
      (resolve, reject) => db.all(sql, [], (err, rows) => {
        if (err) {
          console.log(err);
        }
        resolve(rows);
      })
    );
  }
  static get_emails() {
    const db = new import_sqlite3.Database("maggle.db");
    const sql = "SELECT email FROM user";
    return new Promise(
      (resolve, reject) => db.all(sql, [], (err, rows) => {
        if (err) {
          console.log(err);
        }
        resolve(rows);
      })
    );
  }
  static async exist_user_id(user_id) {
    let res = false;
    await _UserController.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.rowid == user_id) {
          res = true;
        }
      })
    );
    return res;
  }
  static async exist_student_user(user_id) {
    let res = false;
    await _UserController.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.rowid == user_id && row.role == "student") {
          res = true;
        }
      })
    );
    return res;
  }
  static async exist_manager_user(id) {
    let res = false;
    await _UserController.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.rowid == id && row.role == "manager") {
          res = true;
        }
      })
    );
    return res;
  }
  async get(req, res) {
    let { email, password } = req.body;
    let r;
    if (!password || !email) {
      console.log(
        "[ERROR][POST] wrong data on " + _UserController.path + "/connect : " + JSON.stringify(req.body)
      );
      res.status(400).send();
      return;
    }
    let found = false;
    await _UserController.get_values().then(
      (rows) => rows.forEach((row) => {
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
        "[INFO][POST] " + _UserController.path + "/connect " + email
      );
      res.send(JSON.stringify(r));
    } else {
      res.status(400).send();
    }
  }
  static async post_new(p, res) {
    let sql;
    let data;
    const db = new import_sqlite3.Database("maggle.db");
    const exist = await this.exist_email(p.email);
    if (exist) {
      res.status(400).send();
      return;
    }
    sql = "INSERT INTO user VALUES(?,?,?,?,?,?)";
    data = [
      p.name,
      p.family_name,
      p.email,
      p.password,
      p.telephone_number,
      p.role
    ];
    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][POST] sql error " + _UserController.path + " : " + JSON.stringify(p)
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();
    console.log(
      "[INFO][POST] data added on " + _UserController.path + " : " + JSON.stringify(p)
    );
    res.status(200).send();
  }
  static async post_modify(p, res) {
    const db = new import_sqlite3.Database("maggle.db");
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
      p.id
    ];
    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][POST] sql error " + _UserController.path + " : " + JSON.stringify(p)
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();
    console.log(
      "[INFO][POST] data updated on " + _UserController.path + " : " + JSON.stringify(p)
    );
    res.status(200).send();
  }
  static async exist_email(email) {
    let res = false;
    await _UserController.get_emails().then(
      (rows) => rows.forEach((row) => {
        if (row.email == email) {
          res = true;
        }
      })
    );
    return res;
  }
  async post(req, res) {
    let { id, name, family_name, email, password, telephone_number, role } = req.body;
    if (!name || !family_name || !email || !password || !role) {
      console.log(
        "[ERROR][POST] wrong data on " + _UserController.path + " : " + JSON.stringify(req.body)
      );
      res.status(400).send();
      return;
    }
    if (!telephone_number) {
      telephone_number = "";
    }
    if (!id) {
      const element = new User(
        name,
        family_name,
        email,
        password,
        telephone_number,
        role
      );
      _UserController.post_new(element, res);
    } else {
      const element = new UserEntry(
        id,
        name,
        family_name,
        email,
        password,
        telephone_number,
        role
      );
      _UserController.post_modify(element, res);
    }
  }
};
var UserController = _UserController;
UserController.path = "/user";
var user_default = UserController;
var User = class {
  constructor(name, family_name, email, password, telephone_number, role) {
    this.name = name;
    this.family_name = family_name;
    this.email = email;
    this.password = password;
    this.telephone_number = telephone_number;
    this.role = role;
  }
};
var UserEntry = class {
  constructor(id, name, family_name, email, password, telephone_number, role) {
    this.id = id;
    this.name = name;
    this.family_name = family_name;
    this.email = email;
    this.password = password;
    this.telephone_number = telephone_number;
    this.role = role;
  }
};

// src/manager.ts
var _ManagerController = class {
  constructor() {
    this.router = new import_express4.Router();
    this.router.post(_ManagerController.path, this.post);
    this.router.post(_ManagerController.path + "/get", this.get);
  }
  static get_values() {
    const db = new import_sqlite32.Database("maggle.db");
    const sql = "SELECT rowid, * FROM manager";
    return new Promise(
      (resolve, reject) => db.all(sql, [], (err, rows) => {
        if (err) {
          console.log(err);
        }
        resolve(rows);
      })
    );
  }
  static get_manager_by_user_id(user_id) {
    const db = new import_sqlite32.Database("maggle.db");
    const sql = "SELECT rowid, * FROM manager WHERE user_id = ?";
    let params = [user_id];
    return new Promise(
      (resolve, reject) => db.all(sql, params, (err, rows) => {
        if (err) {
          console.log(err);
        }
        resolve(rows);
      })
    );
  }
  static async exist_manager(user_id) {
    let res = false;
    await _ManagerController.get_manager_by_user_id(user_id).then((rows) => {
      if (rows.length > 0) {
        res = true;
      }
    });
    return res;
  }
  async get(req, res) {
    let { user_id, password } = req.body;
    let r;
    if (!password || !user_id) {
      console.log(
        "[ERROR][POST] wrong data on " + _ManagerController.path + ": " + JSON.stringify(req.body)
      );
      res.status(400).send();
      return;
    }
    let identified = false;
    await user_default.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.rowid == user_id && row.password == password) {
          identified = true;
        }
      })
    );
    let found = false;
    if (identified) {
      await _ManagerController.get_values().then(
        (rows) => rows.forEach((row) => {
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
        "[INFO][POST] " + _ManagerController.path + ": " + user_id
      );
      res.send(JSON.stringify(r));
    } else {
      res.status(400).send();
    }
  }
  static async post_new(p, res) {
    let sql;
    let data;
    const db = new import_sqlite32.Database("maggle.db");
    const exist_manager_user = await user_default.exist_manager_user(p.user_id);
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
        "[ERROR][POST] sql error " + _ManagerController.path + " : " + JSON.stringify(p)
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();
    console.log(
      "[INFO][POST] data added on " + _ManagerController.path + " : " + JSON.stringify(p)
    );
    res.status(200).send();
  }
  static async post_modify(p, res) {
    const db = new import_sqlite32.Database("maggle.db");
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
        "[ERROR][POST] sql error " + _ManagerController.path + " : " + JSON.stringify(p)
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();
    console.log(
      "[INFO][POST] data updated on " + _ManagerController.path + " : " + JSON.stringify(p)
    );
    res.status(200).send();
  }
  async post(req, res) {
    let { id, user_id, company, activation_date, deactivation_date, password } = req.body;
    if (!user_id || !company || !activation_date || !deactivation_date) {
      console.log(
        "[ERROR][POST] wrong data on " + _ManagerController.path + " : " + JSON.stringify(req.body)
      );
      res.status(400).send();
      return;
    }
    let identified = false;
    await user_default.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.rowid == user_id && row.password == password) {
          identified = true;
        }
      })
    );
    if (!identified) {
      res.status(401).send("Wrong password!");
      return;
    }
    if (!id) {
      const element = new Manager(
        user_id,
        company,
        activation_date,
        deactivation_date
      );
      _ManagerController.post_new(element, res);
    } else {
      const element = new ManagerEntry(
        id,
        user_id,
        company,
        activation_date,
        deactivation_date
      );
      _ManagerController.post_modify(element, res);
    }
  }
};
var ManagerController = _ManagerController;
ManagerController.path = "/manager";
var manager_default = ManagerController;
var Manager = class {
  constructor(user_id, company, activation_date, deactivation_date) {
    this.user_id = user_id;
    this.company = company;
    this.activation_date = activation_date;
    this.deactivation_date = deactivation_date;
  }
};
var ManagerEntry = class {
  constructor(id, user_id, company, activation_date, deactivation_date) {
    this.id = id;
    this.user_id = user_id;
    this.company = company;
    this.activation_date = activation_date;
    this.deactivation_date = deactivation_date;
  }
};

// src/student.ts
var import_express5 = require("express");
var import_sqlite33 = require("sqlite3");
var _StudentController = class {
  constructor() {
    this.router = new import_express5.Router();
    this.router.post(_StudentController.path, this.post);
    this.router.post(_StudentController.path + "/get", this.get);
  }
  static get_values() {
    const db = new import_sqlite33.Database("maggle.db");
    const sql = "SELECT rowid, * FROM student";
    return new Promise(
      (resolve, reject) => db.all(sql, [], (err, rows) => {
        if (err) {
          console.log(err);
        }
        resolve(rows);
      })
    );
  }
  static async get_rowid(user_id) {
    let id = -1;
    await _StudentController.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.user_id == user_id) {
          id = row.user_id;
        }
      })
    );
    return id;
  }
  static get_student_by_user_id(user_id) {
    const db = new import_sqlite33.Database("maggle.db");
    const sql = "SELECT rowid, * FROM student WHERE user_id = ?";
    let params = [user_id];
    return new Promise(
      (resolve, reject) => db.all(sql, params, (err, rows) => {
        if (err) {
          console.log(err);
        }
        resolve(rows);
      })
    );
  }
  static async exist_student(user_id) {
    let res = false;
    await _StudentController.get_student_by_user_id(user_id).then((rows) => {
      if (rows.length > 0) {
        res = true;
      }
    });
    return res;
  }
  async get(req, res) {
    let { user_id, password } = req.body;
    let r;
    if (!password || !user_id) {
      console.log(
        "[ERROR][POST] wrong data on " + _StudentController.path + "/get: " + JSON.stringify(req.body)
      );
      res.status(400).send();
      return;
    }
    let identified = false;
    await user_default.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.rowid == user_id && row.password == password) {
          identified = true;
        }
      })
    );
    if (!identified) {
      res.status(401).send("Wrong password!");
      return;
    }
    let found = false;
    await _StudentController.get_values().then(
      (rows) => rows.forEach((row) => {
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
        "[INFO][POST] " + _StudentController.path + ": " + user_id
      );
      res.send(JSON.stringify(r));
    } else {
      res.status(400).send();
    }
  }
  static async post_new(p, res) {
    let sql;
    let data;
    const db = new import_sqlite33.Database("maggle.db");
    const exist_user = await user_default.exist_student_user(p.user_id);
    if (!exist_user) {
      res.status(400).send("[POST][NEW] User doesn't exist!");
      return;
    }
    const exist_student = await this.exist_student(p.user_id);
    if (exist_student) {
      res.status(400).send("[POST][NEW] Student already exist!");
      return;
    }
    sql = "INSERT INTO student VALUES(?,?,?,?)";
    data = [
      p.user_id,
      p.school_level,
      p.school,
      p.city
    ];
    let e;
    db.run(sql, data, function(err) {
      if (err) {
        console.log(
          "[ERROR][POST] sql error " + _StudentController.path + " : " + JSON.stringify(p)
        );
        console.error(e.message);
        res.status(500).send();
        return;
      }
      console.log(
        "[INFO][POST] data added on " + _StudentController.path + " : " + JSON.stringify(p)
      );
      res.status(200).send(JSON.stringify({ "id:": this.lastID }));
    });
    db.close();
  }
  static async post_modify(p, res) {
    const db = new import_sqlite33.Database("maggle.db");
    const exist = await user_default.exist_user_id(p.user_id);
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
        "[ERROR][POST] sql error " + _StudentController.path + " : " + JSON.stringify(p)
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();
    console.log(
      "[INFO][POST] data updated on " + _StudentController.path + " : " + JSON.stringify(p)
    );
    res.status(200).send();
  }
  async post(req, res) {
    let { id, user_id, school_level, school, city, password } = req.body;
    if (!user_id || !school_level || !school || !city || !password) {
      console.log(
        "[ERROR][POST] wrong data on " + _StudentController.path + " : " + JSON.stringify(req.body)
      );
      res.status(400).send();
      return;
    }
    let identified = false;
    await user_default.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.rowid == user_id && row.password == password) {
          identified = true;
        }
      })
    );
    if (!identified) {
      res.status(401).send("Wrong password!");
      return;
    }
    if (!id) {
      const element = new Student(
        user_id,
        school_level,
        school,
        city
      );
      _StudentController.post_new(element, res);
    } else {
      const element = new StudentEntry(
        id,
        user_id,
        school_level,
        school,
        city
      );
      _StudentController.post_modify(element, res);
    }
  }
};
var StudentController = _StudentController;
StudentController.path = "/student";
var student_default = StudentController;
var Student = class {
  constructor(user_id, school_level, school, city) {
    this.user_id = user_id;
    this.school_level = school_level;
    this.school = school;
    this.city = city;
  }
};
var StudentEntry = class {
  constructor(id, user_id, school_level, school, city) {
    this.id = id;
    this.user_id = user_id;
    this.school_level = school_level;
    this.school = school;
    this.city = city;
  }
};

// src/data_challenge.ts
var import_express6 = require("express");
var import_sqlite34 = require("sqlite3");
var _DataChallengeController = class {
  constructor() {
    this.router = new import_express6.Router();
    this.router.post(_DataChallengeController.path, this.post);
    this.router.get(_DataChallengeController.path, this.get_all);
    this.router.get(_DataChallengeController.path + "/:id", this.get);
  }
  static get_values() {
    const db = new import_sqlite34.Database("maggle.db");
    const sql = "SELECT rowid, * FROM data_challenge";
    return new Promise(
      (resolve, reject) => db.all(sql, [], (err, rows) => {
        if (err) {
          console.log(err);
        }
        resolve(rows);
      })
    );
  }
  async get_all(req, res) {
    let r = new Array();
    await _DataChallengeController.get_values().then(
      (rows) => rows.forEach((row) => {
        r.push(new DataChallengeEntry(
          row.rowid,
          row.name,
          row.date_time_start,
          row.date_time_end
        ));
      })
    );
    res.send(JSON.stringify(r));
  }
  async get(req, res) {
    let id = req.params.id;
    let r;
    let found = false;
    await _DataChallengeController.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.rowid == id) {
          found = true;
          r = new DataChallengeEntry(
            row.rowid,
            row.name,
            row.date_time_start,
            row.date_time_end
          );
        }
      })
    );
    if (found) {
      console.log(
        "[INFO][POST] " + _DataChallengeController.path + ": " + id
      );
      res.send(JSON.stringify(r));
    } else {
      res.status(400).send();
    }
  }
  static async post_new(p, res) {
    let sql;
    let data;
    const db = new import_sqlite34.Database("maggle.db");
    sql = "INSERT INTO data_challenge VALUES(?,?,?)";
    data = [
      p.name,
      p.date_time_start,
      p.date_time_end
    ];
    let e;
    db.run(sql, data, function(err) {
      if (err) {
        console.log(
          "[ERROR][POST] sql error " + _DataChallengeController.path + " : " + JSON.stringify(p)
        );
        console.error(e.message);
        res.status(500).send();
        return;
      }
      console.log(
        "[INFO][POST] data added on " + _DataChallengeController.path + " : " + JSON.stringify(p)
      );
      res.status(200).send(JSON.stringify({ "id:": this.lastID }));
    });
    db.close();
  }
  static async post_modify(p, res) {
    const db = new import_sqlite34.Database("maggle.db");
    const sql = `UPDATE data_challenge SET
        name = ?, date_time_start = ?, date_time_end = ?
        WHERE rowid = ?`;
    const data = [
      p.name,
      p.date_time_start,
      p.date_time_end,
      p.id
    ];
    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][POST] sql error " + _DataChallengeController.path + " : " + JSON.stringify(p)
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();
    console.log(
      "[INFO][POST] data updated on " + _DataChallengeController.path + " : " + JSON.stringify(p)
    );
    res.status(200).send();
  }
  async post(req, res) {
    let { id, name, date_time_start, date_time_end, password } = req.body;
    if (!name || !date_time_start || !date_time_end || !password) {
      console.log(
        "[ERROR][POST] wrong data on " + _DataChallengeController.path + " : " + JSON.stringify(req.body)
      );
      res.status(400).send();
      return;
    }
    let identified = false;
    await user_default.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.role == "admin" && row.password == password) {
          identified = true;
        }
      })
    );
    if (!identified) {
      res.status(401).send("Wrong password!");
      return;
    }
    if (!id) {
      const element = new DataChallenge(
        name,
        date_time_start,
        date_time_end
      );
      _DataChallengeController.post_new(element, res);
    } else {
      const element = new DataChallengeEntry(
        id,
        name,
        date_time_start,
        date_time_end
      );
      _DataChallengeController.post_modify(element, res);
    }
  }
};
var DataChallengeController = _DataChallengeController;
DataChallengeController.path = "/challenge";
var data_challenge_default = DataChallengeController;
var DataChallenge = class {
  constructor(name, date_time_start, date_time_end) {
    this.name = name;
    this.date_time_start = date_time_start;
    this.date_time_end = date_time_end;
  }
};
var DataChallengeEntry = class {
  constructor(id, name, date_time_start, date_time_end) {
    this.id = id;
    this.name = name;
    this.date_time_start = date_time_start;
    this.date_time_end = date_time_end;
  }
};

// src/index.ts
var controllers = [
  new user_default(),
  new student_default(),
  new manager_default(),
  new file_default(),
  new data_challenge_default()
  //new DataProjectController(),
];
var app = new app_default(
  controllers,
  8080
);
app.listen();
