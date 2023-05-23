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
    this.router = (0, import_express2.Router)();
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
var import_bcrypt = __toESM(require("bcrypt"));
var _UserController = class {
  constructor() {
    this.router = (0, import_express3.Router)();
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
  static async identifyStudent(user_id, password) {
    let res = false;
    await _UserController.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.role == "student" && row.rowid == user_id) {
          const match = import_bcrypt.default.compareSync(password, row.password);
          if (match) {
            res = true;
          }
        }
      })
    );
    return res;
  }
  static async identifyAdmin(password) {
    let res = false;
    await _UserController.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.role == "admin") {
          const match = import_bcrypt.default.compareSync(password, row.password);
          if (match) {
            res = true;
          }
        }
      })
    );
    return res;
  }
  static async identifyManager(user_id, password) {
    let res = false;
    await _UserController.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.role == "manager" && row.rowid == user_id) {
          const match = import_bcrypt.default.compareSync(password, row.password);
          if (match) {
            res = true;
          }
        }
      })
    );
    return res;
  }
  static async identifyUser(user_id, password) {
    let res = false;
    await _UserController.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.rowid == user_id) {
          const match = import_bcrypt.default.compareSync(password, row.password);
          if (match) {
            res = true;
          }
        }
      })
    );
    return res;
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
    p.password = import_bcrypt.default.hashSync(p.password, 10);
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
    p.password = import_bcrypt.default.hashSync(p.password, 10);
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
    this.router = (0, import_express4.Router)();
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
    let identified = await user_default.identifyUser(user_id, password);
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
    let identified = await user_default.identifyUser(user_id, password);
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
    this.router = (0, import_express5.Router)();
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
    let identified = await user_default.identifyUser(user_id, password);
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
    let identified = await user_default.identifyUser(user_id, password);
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
    this.router = (0, import_express6.Router)();
    this.router.post(_DataChallengeController.path, this.post);
    this.router.get(_DataChallengeController.path, this.get_all);
    this.router.get(_DataChallengeController.path + "/:id", this.get);
    this.router.delete(_DataChallengeController.path, this.delete);
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
  static async exist_data_challenge(data_challenge_id) {
    let res = false;
    await _DataChallengeController.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.rowid == data_challenge_id) {
          res = true;
        }
      })
    );
    return res;
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
    let identified = await user_default.identifyAdmin(password);
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
  async delete(req, res) {
    const db = new import_sqlite34.Database("maggle.db");
    const { id, password } = req.body;
    if (!id || !password) {
      console.log(
        "[ERROR][DELETE] wrong data on " + _DataChallengeController.path + " : " + JSON.stringify(req.body)
      );
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
    const sql = `DELETE FROM data_challenge
        WHERE rowid = ?`;
    const data = [id];
    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][DELETE] sql error " + _DataChallengeController.path + " : " + JSON.stringify(id)
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();
    console.log(
      "[INFO][DELETE] data deleted on " + _DataChallengeController.path + " : " + JSON.stringify(id)
    );
    res.status(200).send();
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

// src/data_project.ts
var import_express7 = require("express");
var import_sqlite35 = require("sqlite3");
var _DataProjectController = class {
  constructor() {
    this.router = (0, import_express7.Router)();
    this.router.post(_DataProjectController.path, this.post);
    this.router.get(_DataProjectController.path, this.get_all);
    this.router.get(_DataProjectController.path + "/:id", this.get);
    this.router.delete(_DataProjectController.path, this.delete);
  }
  static get_values() {
    const db = new import_sqlite35.Database("maggle.db");
    const sql = "SELECT rowid, * FROM data_project";
    return new Promise(
      (resolve, reject) => db.all(sql, [], (err, rows) => {
        if (err) {
          console.log(err);
        }
        resolve(rows);
      })
    );
  }
  static async exist_data_project(data_project_id) {
    let res = false;
    await _DataProjectController.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.rowid == data_project_id) {
          res = true;
        }
      })
    );
    return res;
  }
  async get(req, res) {
    let id = req.params.id;
    let r;
    if (!id) {
      console.log(
        "[ERROR][GET] wrong data on " + _DataProjectController.path + "/" + id + ": " + JSON.stringify(req.body)
      );
      res.status(400).send();
      return;
    }
    let found = false;
    await _DataProjectController.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.rowid == id) {
          found = true;
          r = new DataProjectEntry(
            row.rowid,
            row.data_challenge_id,
            row.name,
            row.description,
            row.image
          );
        }
      })
    );
    if (found) {
      console.log(
        "[INFO][GET] " + _DataProjectController.path + "/" + id + ": "
      );
      res.send(JSON.stringify(r));
    } else {
      res.status(400).send();
    }
  }
  async get_all(req, res) {
    let r = new Array();
    await _DataProjectController.get_values().then(
      (rows) => rows.forEach((row) => {
        r.push(new DataProjectEntry(
          row.rowid,
          row.data_challenge_id,
          row.name,
          row.description,
          row.image
        ));
      })
    );
    console.log(
      "[INFO][GET] " + _DataProjectController.path + ": "
    );
    res.send(JSON.stringify(r));
  }
  static async post_new(p, res) {
    let sql;
    let data;
    const db = new import_sqlite35.Database("maggle.db");
    const exist = await data_challenge_default.exist_data_challenge(p.data_challenge_id);
    if (!exist) {
      res.status(400).send();
      return;
    }
    sql = "INSERT INTO data_project VALUES(?,?,?,?)";
    data = [
      p.data_challenge_id,
      p.name,
      p.description,
      p.image
    ];
    let e;
    db.run(sql, data, function(err) {
      if (err) {
        console.log(
          "[ERROR][POST] sql error " + _DataProjectController.path + " : " + JSON.stringify(p)
        );
        console.error(e.message);
        res.status(500).send();
        return;
      }
      console.log(
        "[INFO][POST] data added on " + _DataProjectController.path + " : " + JSON.stringify(p)
      );
      res.status(200).send(JSON.stringify({ "id:": this.lastID }));
    });
    db.close();
  }
  static async post_modify(p, res) {
    const db = new import_sqlite35.Database("maggle.db");
    const exist = await data_challenge_default.exist_data_challenge(p.data_challenge_id);
    if (!exist) {
      res.status(400).send();
      return;
    }
    const sql = `UPDATE data_project SET
        data_challenge_id = ?, name = ?, description = ?, image = ?
        WHERE rowid = ?`;
    const data = [
      p.data_challenge_id,
      p.name,
      p.description,
      p.image,
      p.id
    ];
    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][POST] sql error " + _DataProjectController.path + " : " + JSON.stringify(p)
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();
    console.log(
      "[INFO][POST] data updated on " + _DataProjectController.path + " : " + JSON.stringify(p)
    );
    res.status(200).send();
  }
  async post(req, res) {
    let { id, data_challenge_id, name, description, image, password } = req.body;
    if (!data_challenge_id || !name || !description || !image || !password) {
      console.log(
        "[ERROR][POST] wrong data on " + _DataProjectController.path + " : " + JSON.stringify(req.body)
      );
      res.status(400).send();
      return;
    }
    let identified = await user_default.identifyAdmin(password);
    if (!identified) {
      res.status(401).send("Wrong password!");
      return;
    }
    if (!id) {
      const element = new DataProject(
        data_challenge_id,
        name,
        description,
        image
      );
      _DataProjectController.post_new(element, res);
    } else {
      const element = new DataProjectEntry(
        id,
        data_challenge_id,
        name,
        description,
        image
      );
      _DataProjectController.post_modify(element, res);
    }
  }
  async delete(req, res) {
    const db = new import_sqlite35.Database("maggle.db");
    const { id, password } = req.body;
    if (!id || !password) {
      console.log(
        "[ERROR][DELETE] wrong data on " + data_challenge_default.path + " : " + JSON.stringify(req.body)
      );
    }
    let identified = user_default.identifyAdmin(password);
    if (!identified) {
      res.status(401).send("Wrong password!");
      return;
    }
    const sql = `DELETE FROM data_project
        WHERE rowid = ?`;
    const data = [id];
    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][DELETE] sql error " + _DataProjectController.path + " : " + JSON.stringify(id)
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();
    console.log(
      "[INFO][DELETE] data deleted on " + _DataProjectController.path + " : " + JSON.stringify(id)
    );
    res.status(200).send();
  }
};
var DataProjectController = _DataProjectController;
DataProjectController.path = "/project";
var data_project_default = DataProjectController;
var DataProject = class {
  constructor(data_challenge_id, name, description, image) {
    this.data_challenge_id = data_challenge_id;
    this.name = name;
    this.description = description;
    this.image = image;
  }
};
var DataProjectEntry = class {
  constructor(id, data_challenge_id, name, description, image) {
    this.id = id;
    this.data_challenge_id = data_challenge_id;
    this.name = name;
    this.description = description;
    this.image = image;
  }
};

// src/resource_challenge.ts
var import_express8 = require("express");
var import_sqlite36 = require("sqlite3");
var _ResourceChallengeController = class {
  constructor() {
    this.router = (0, import_express8.Router)();
    this.router.post(_ResourceChallengeController.path, this.post);
    this.router.get(_ResourceChallengeController.path, this.get_all);
    this.router.get(_ResourceChallengeController.path + "/:id", this.get);
    this.router.delete(_ResourceChallengeController.path, this.delete);
  }
  static get_values() {
    const db = new import_sqlite36.Database("maggle.db");
    const sql = "SELECT rowid, * FROM resource_challenge";
    return new Promise(
      (resolve, reject) => db.all(sql, [], (err, rows) => {
        if (err) {
          console.log(err);
        }
        resolve(rows);
      })
    );
  }
  async get(req, res) {
    let id = req.params.id;
    let r;
    if (!id) {
      console.log(
        "[ERROR][GET] wrong data on " + _ResourceChallengeController.path + "/" + id + ": " + JSON.stringify(req.body)
      );
      res.status(400).send();
      return;
    }
    let found = false;
    await _ResourceChallengeController.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.rowid == id) {
          found = true;
          r = new ResourceChallengeEntry(
            row.rowid,
            row.data_challenge_id,
            row.name,
            row.url
          );
        }
      })
    );
    if (found) {
      console.log(
        "[INFO][GET] " + _ResourceChallengeController.path + "/" + id + ": "
      );
      res.send(JSON.stringify(r));
    } else {
      res.status(400).send();
    }
  }
  async get_all(req, res) {
    let r = new Array();
    await _ResourceChallengeController.get_values().then(
      (rows) => rows.forEach((row) => {
        r.push(new ResourceChallengeEntry(
          row.rowid,
          row.data_challenge_id,
          row.name,
          row.url
        ));
      })
    );
    console.log(
      "[INFO][GET] " + _ResourceChallengeController.path + ": "
    );
    res.send(JSON.stringify(r));
  }
  static async post_new(p, res) {
    let sql;
    let data;
    const db = new import_sqlite36.Database("maggle.db");
    const exist = await data_challenge_default.exist_data_challenge(p.data_challenge_id);
    if (!exist) {
      res.status(400).send();
      return;
    }
    sql = "INSERT INTO resource_challenge VALUES(?,?,?)";
    data = [
      p.data_challenge_id,
      p.name,
      p.url
    ];
    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][POST] sql error " + _ResourceChallengeController.path + " : " + JSON.stringify(p)
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();
    console.log(
      "[INFO][POST] data added on " + _ResourceChallengeController.path + " : " + JSON.stringify(p)
    );
    res.status(200).send();
  }
  static async post_modify(p, res) {
    const db = new import_sqlite36.Database("maggle.db");
    const exist = await data_challenge_default.exist_data_challenge(p.data_challenge_id);
    if (!exist) {
      res.status(400).send();
      return;
    }
    const sql = `UPDATE resource_challenge SET
        data_challenge_id = ?, name = ?, url = ?
        WHERE rowid = ?`;
    const data = [
      p.data_challenge_id,
      p.name,
      p.url
    ];
    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][POST] sql error " + _ResourceChallengeController.path + " : " + JSON.stringify(p)
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();
    console.log(
      "[INFO][POST] data updated on " + _ResourceChallengeController.path + " : " + JSON.stringify(p)
    );
    res.status(200).send();
  }
  async post(req, res) {
    let { id, data_challenge_id, name, url, password } = req.body;
    if (!data_challenge_id || !name || !url || !password) {
      console.log(
        "[ERROR][POST] wrong data on " + _ResourceChallengeController.path + " : " + JSON.stringify(req.body)
      );
      res.status(400).send();
      return;
    }
    let identified = await user_default.identifyAdmin(password);
    if (!identified) {
      res.status(401).send("Wrong password!");
      return;
    }
    if (!id) {
      const element = new ResourceChallenge(
        data_challenge_id,
        name,
        url
      );
      _ResourceChallengeController.post_new(element, res);
    } else {
      const element = new ResourceChallengeEntry(
        id,
        data_challenge_id,
        name,
        url
      );
      _ResourceChallengeController.post_modify(element, res);
    }
  }
  async delete(req, res) {
    const db = new import_sqlite36.Database("maggle.db");
    const { id, password } = req.body;
    if (!id || !password) {
      console.log(
        "[ERROR][DELETE] wrong data on " + _ResourceChallengeController.path + " : " + JSON.stringify(req.body)
      );
    }
    let identified = await user_default.identifyAdmin(password);
    if (!identified) {
      res.status(401).send("Wrong password!");
      return;
    }
    const sql = `DELETE FROM resource_challenge
        WHERE rowid = ?`;
    const data = [id];
    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][DELETE] sql error " + _ResourceChallengeController.path + " : " + JSON.stringify(id)
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();
    console.log(
      "[INFO][DELETE] data deleted on " + _ResourceChallengeController.path + " : " + JSON.stringify(id)
    );
    res.status(200).send();
  }
};
var ResourceChallengeController = _ResourceChallengeController;
ResourceChallengeController.path = "/resource-challenge";
var resource_challenge_default = ResourceChallengeController;
var ResourceChallenge = class {
  constructor(data_challenge_id, name, url) {
    this.data_challenge_id = data_challenge_id;
    this.name = name;
    this.url = url;
  }
};
var ResourceChallengeEntry = class {
  constructor(id, data_challenge_id, name, url) {
    this.id = id;
    this.data_challenge_id = data_challenge_id;
    this.name = name;
    this.url = url;
  }
};

// src/resource_project.ts
var import_express9 = require("express");
var import_sqlite37 = require("sqlite3");
var _ResourceProjectController = class {
  constructor() {
    this.router = (0, import_express9.Router)();
    this.router.post(_ResourceProjectController.path, this.post);
    this.router.get(_ResourceProjectController.path, this.get_all);
    this.router.get(_ResourceProjectController.path + "/:id", this.get);
    this.router.delete(_ResourceProjectController.path, this.delete);
  }
  static get_values() {
    const db = new import_sqlite37.Database("maggle.db");
    const sql = "SELECT rowid, * FROM resource_project";
    return new Promise(
      (resolve, reject) => db.all(sql, [], (err, rows) => {
        if (err) {
          console.log(err);
        }
        resolve(rows);
      })
    );
  }
  async get(req, res) {
    let id = req.params.id;
    let r;
    if (!id) {
      console.log(
        "[ERROR][GET] wrong data on " + _ResourceProjectController.path + "/" + id + ": " + JSON.stringify(req.body)
      );
      res.status(400).send();
      return;
    }
    let found = false;
    await _ResourceProjectController.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.rowid == id) {
          found = true;
          r = new ResourceProjectEntry(
            row.rowid,
            row.data_project_id,
            row.name,
            row.url
          );
        }
      })
    );
    if (found) {
      console.log(
        "[INFO][GET] " + _ResourceProjectController.path + "/" + id + ": "
      );
      res.send(JSON.stringify(r));
    } else {
      res.status(400).send();
    }
  }
  async get_all(req, res) {
    let r = new Array();
    await _ResourceProjectController.get_values().then(
      (rows) => rows.forEach((row) => {
        r.push(new ResourceProjectEntry(
          row.rowid,
          row.data_project_id,
          row.name,
          row.url
        ));
      })
    );
    console.log(
      "[INFO][GET] " + _ResourceProjectController.path + ": "
    );
    res.send(JSON.stringify(r));
  }
  static async post_new(p, res) {
    let sql;
    let data;
    const db = new import_sqlite37.Database("maggle.db");
    const exist = await data_project_default.exist_data_project(p.data_project_id);
    if (!exist) {
      res.status(400).send();
      return;
    }
    sql = "INSERT INTO resource_project VALUES(?,?,?)";
    data = [
      p.data_project_id,
      p.name,
      p.url
    ];
    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][POST] sql error " + _ResourceProjectController.path + " : " + JSON.stringify(p)
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();
    console.log(
      "[INFO][POST] data added on " + _ResourceProjectController.path + " : " + JSON.stringify(p)
    );
    res.status(200).send();
  }
  static async post_modify(p, res) {
    const db = new import_sqlite37.Database("maggle.db");
    const exist = await data_project_default.exist_data_project(p.data_project_id);
    if (!exist) {
      res.status(400).send();
      return;
    }
    const sql = `UPDATE resource_project SET
        data_project_id = ?, name = ?, url = ?
        WHERE rowid = ?`;
    const data = [
      p.data_project_id,
      p.name,
      p.url,
      p.id
    ];
    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][POST] sql error " + _ResourceProjectController.path + " : " + JSON.stringify(p)
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();
    console.log(
      "[INFO][POST] data updated on " + _ResourceProjectController.path + " : " + JSON.stringify(p)
    );
    res.status(200).send();
  }
  async post(req, res) {
    let { id, data_project_id, name, url, password } = req.body;
    if (!data_project_id || !name || !url || !password) {
      console.log(
        "[ERROR][POST] wrong data on " + _ResourceProjectController.path + " : " + JSON.stringify(req.body)
      );
      res.status(400).send();
      return;
    }
    let identified = await user_default.identifyAdmin(password);
    if (!identified) {
      res.status(401).send("Wrong password!");
      return;
    }
    if (!id) {
      const element = new ResourceProject(
        data_project_id,
        name,
        url
      );
      _ResourceProjectController.post_new(element, res);
    } else {
      const element = new ResourceProjectEntry(
        id,
        data_project_id,
        name,
        url
      );
      _ResourceProjectController.post_modify(element, res);
    }
  }
  async delete(req, res) {
    const db = new import_sqlite37.Database("maggle.db");
    const { id, password } = req.body;
    if (!id || !password) {
      console.log(
        "[ERROR][DELETE] wrong data on " + _ResourceProjectController.path + " : " + JSON.stringify(req.body)
      );
    }
    let identified = await user_default.identifyAdmin(password);
    if (!identified) {
      res.status(401).send("Wrong password!");
      return;
    }
    const sql = `DELETE FROM resource_project
        WHERE rowid = ?`;
    const data = [id];
    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][DELETE] sql error " + _ResourceProjectController.path + " : " + JSON.stringify(id)
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();
    console.log(
      "[INFO][DELETE] data deleted on " + _ResourceProjectController.path + " : " + JSON.stringify(id)
    );
    res.status(200).send();
  }
};
var ResourceProjectController = _ResourceProjectController;
ResourceProjectController.path = "/resource-project";
var resource_project_default = ResourceProjectController;
var ResourceProject = class {
  constructor(data_project_id, name, url) {
    this.data_project_id = data_project_id;
    this.name = name;
    this.url = url;
  }
};
var ResourceProjectEntry = class {
  constructor(id, data_project_id, name, url) {
    this.id = id;
    this.data_project_id = data_project_id;
    this.name = name;
    this.url = url;
  }
};

// src/member.ts
var import_express11 = require("express");
var import_sqlite39 = require("sqlite3");

// src/team.ts
var import_express10 = require("express");
var import_sqlite38 = require("sqlite3");
var _TeamController = class {
  constructor() {
    this.router = (0, import_express10.Router)();
    this.router.post(_TeamController.path, this.post);
    this.router.get(_TeamController.path, this.get_all);
    this.router.get(_TeamController.path + "/:id", this.get);
    this.router.delete(_TeamController.path, this.delete);
  }
  static get_values() {
    const db = new import_sqlite38.Database("maggle.db");
    const sql = "SELECT rowid, * FROM team";
    return new Promise(
      (resolve, reject) => db.all(sql, [], (err, rows) => {
        if (err) {
          console.log(err);
        }
        resolve(rows);
      })
    );
  }
  static async exist_team_id(team_id) {
    let res = false;
    await _TeamController.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.rowid == team_id) {
          res = true;
        }
      })
    );
    return res;
  }
  static get_user_captain_id_by_team_id(team_id) {
    const db = new import_sqlite38.Database("maggle.db");
    const sql = "SELECT user_captain_id FROM team WHERE rowid = ?";
    let params = [team_id];
    return new Promise(
      (resolve, reject) => db.get(sql, params, (err, row) => {
        if (err) {
          console.log(err);
        }
        resolve(row.user_captain_id);
      })
    );
  }
  async get(req, res) {
    let id = req.params.id;
    let r;
    if (!id) {
      console.log(
        "[ERROR][GET] wrong data on " + _TeamController.path + "/" + id + ": " + JSON.stringify(req.body)
      );
      res.status(400).send();
      return;
    }
    let found = false;
    await _TeamController.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.rowid == id) {
          found = true;
          r = new TeamEntry(
            row.rowid,
            row.user_captain_id,
            row.data_project_id
          );
        }
      })
    );
    if (found) {
      console.log(
        "[INFO][GET] " + _TeamController.path + "/" + id + ": "
      );
      res.send(JSON.stringify(r));
    } else {
      res.status(400).send();
    }
  }
  async get_all(req, res) {
    let r = new Array();
    await _TeamController.get_values().then(
      (rows) => rows.forEach((row) => {
        r.push(new TeamEntry(
          row.rowid,
          row.user_captain_id,
          row.data_project_id
        ));
      })
    );
    console.log(
      "[INFO][GET] " + _TeamController.path + ": "
    );
    res.send(JSON.stringify(r));
  }
  static async post_new(p, res) {
    let sql;
    let data;
    const db = new import_sqlite38.Database("maggle.db");
    sql = "INSERT INTO team VALUES(?,?)";
    data = [
      p.user_captain_id,
      p.data_project_id
    ];
    let e;
    db.run(sql, data, function(err) {
      if (err) {
        console.log(
          "[ERROR][POST] sql error " + _TeamController.path + " : " + JSON.stringify(p)
        );
        console.error(e.message);
        res.status(500).send();
        return;
      }
      console.log(
        "[INFO][POST] data added on " + _TeamController.path + " : " + JSON.stringify(p)
      );
      res.status(200).send(JSON.stringify({ "id:": this.lastID }));
    });
    db.close();
  }
  static async post_modify(p, res) {
    const db = new import_sqlite38.Database("maggle.db");
    const sql = `UPDATE team SET
        user_captain_id = ?, data_project_id = ?
        WHERE rowid = ?`;
    const data = [
      p.user_captain_id,
      p.data_project_id,
      p.id
    ];
    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][POST] sql error " + _TeamController.path + " : " + JSON.stringify(p)
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();
    console.log(
      "[INFO][POST] data updated on " + _TeamController.path + " : " + JSON.stringify(p)
    );
    res.status(200).send();
  }
  async post(req, res) {
    let { id, user_captain_id, data_project_id, password } = req.body;
    if (!user_captain_id || !data_project_id || !password) {
      console.log(
        "[ERROR][POST] wrong data on " + _TeamController.path + " : " + JSON.stringify(req.body)
      );
      res.status(400).send();
      return;
    }
    let identified = await user_default.identifyStudent(user_captain_id, password);
    if (!identified) {
      res.status(401).send("Wrong password!");
      return;
    }
    if (!id) {
      const element = new Team(
        user_captain_id,
        data_project_id
      );
      _TeamController.post_new(element, res);
    } else {
      const element = new TeamEntry(
        id,
        user_captain_id,
        data_project_id
      );
      _TeamController.post_modify(element, res);
    }
  }
  async delete(req, res) {
    const db = new import_sqlite38.Database("maggle.db");
    const { id, user_captain_id, password } = req.body;
    if (!id || !password) {
      console.log(
        "[ERROR][DELETE] wrong data on " + _TeamController.path + " : " + JSON.stringify(req.body)
      );
    }
    let identified = await user_default.identifyStudent(user_captain_id, password);
    if (!identified) {
      res.status(401).send("Wrong password!");
      return;
    }
    const sql = `DELETE FROM team
        WHERE rowid = ?`;
    const data = [id];
    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][DELETE] sql error " + _TeamController.path + " : " + JSON.stringify(id)
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();
    console.log(
      "[INFO][DELETE] data deleted on " + _TeamController.path + " : " + JSON.stringify(id)
    );
    res.status(200).send();
  }
};
var TeamController = _TeamController;
TeamController.path = "/team";
var team_default = TeamController;
var Team = class {
  constructor(user_captain_id, data_project_id) {
    this.user_captain_id = user_captain_id;
    this.data_project_id = data_project_id;
  }
};
var TeamEntry = class {
  constructor(id, user_captain_id, data_project_id) {
    this.id = id;
    this.user_captain_id = user_captain_id;
    this.data_project_id = data_project_id;
  }
};

// src/member.ts
var _MemberController = class {
  constructor() {
    this.router = (0, import_express11.Router)();
    this.router.post(_MemberController.path, this.post);
    this.router.get(_MemberController.path, this.get_all);
    this.router.get(_MemberController.path + "/:id", this.get);
    this.router.delete(_MemberController.path, this.delete);
  }
  static get_values() {
    const db = new import_sqlite39.Database("maggle.db");
    const sql = "SELECT rowid, * FROM member";
    return new Promise(
      (resolve, reject) => db.all(sql, [], (err, rows) => {
        if (err) {
          console.log(err);
        }
        resolve(rows);
      })
    );
  }
  async get(req, res) {
    let id = req.params.id;
    let r = new Array();
    if (!id) {
      console.log(
        "[ERROR][GET] wrong data on " + _MemberController.path + "/" + id + ": " + JSON.stringify(req.body)
      );
      res.status(400).send();
      return;
    }
    let found = false;
    await _MemberController.get_values().then(
      (rows) => rows.forEach((row) => {
        if (row.team_id == id) {
          found = true;
          r.push(new MemberEntry(
            row.rowid,
            row.team_id,
            row.user_id
          ));
        }
      })
    );
    if (found) {
      console.log(
        "[INFO][GET] " + _MemberController.path + "/" + id + ": "
      );
      res.send(JSON.stringify(r));
    } else {
      res.status(400).send();
    }
  }
  async get_all(req, res) {
    let r = new Array();
    await _MemberController.get_values().then(
      (rows) => rows.forEach((row) => {
        r.push(new MemberEntry(
          row.rowid,
          row.team_id,
          row.user_id
        ));
      })
    );
    console.log(
      "[INFO][GET] " + _MemberController.path + ": "
    );
    res.send(JSON.stringify(r));
  }
  static async exist_team_member(p) {
    let res = false;
    const db = new import_sqlite39.Database("maggle.db");
    const sql = "SELECT rowid, * FROM member WHERE team_id = ? AND user_id = ?";
    let params = [p.team_id, p.user_id];
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.log(err);
      }
      if (rows.length > 1)
        res = true;
    });
    db.close();
    return res;
  }
  static async post_new(p, res) {
    let sql;
    let data;
    const db = new import_sqlite39.Database("maggle.db");
    const exist_user = await user_default.exist_user_id(p.user_id);
    if (!exist_user) {
      res.status(400).send("[POST][NEW] User doesn't exist!");
      return;
    }
    const exist_team_member = await this.exist_team_member(p);
    if (exist_team_member) {
      res.status(400).send("[POST][NEW] User already exist in this team!");
      return;
    }
    sql = "INSERT INTO member VALUES(?,?)";
    data = [
      p.team_id,
      p.user_id
    ];
    let e;
    db.run(sql, data, function(err) {
      if (err) {
        console.log(
          "[ERROR][POST] sql error " + _MemberController.path + " : " + JSON.stringify(p)
        );
        console.error(e.message);
        res.status(500).send();
        return;
      }
      console.log(
        "[INFO][POST] data added on " + _MemberController.path + " : " + JSON.stringify(p)
      );
      res.status(200).send(JSON.stringify({ "id:": this.lastID }));
    });
    db.close();
  }
  static async post_modify(p, res) {
    const db = new import_sqlite39.Database("maggle.db");
    const exist_user = await user_default.exist_user_id(p.user_id);
    if (!exist_user) {
      res.status(400).send("[POST][MODIFY] User doesn't exist!");
      return;
    }
    const exist_team = await team_default.exist_team_id(p.team_id);
    if (!exist_team) {
      res.status(400).send("[POST][MODIFY] User doesn't exist!");
      return;
    }
    const sql = `UPDATE member SET
        team_id = ?, user_id = ?
        WHERE rowid = ?`;
    const data = [
      p.team_id,
      p.user_id,
      p.id
    ];
    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][POST] sql error " + _MemberController.path + " : " + JSON.stringify(p)
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();
    console.log(
      "[INFO][POST] data updated on " + _MemberController.path + " : " + JSON.stringify(p)
    );
    res.status(200).send();
  }
  async post(req, res) {
    let { id, team_id, user_id, password } = req.body;
    if (!user_id || !team_id || !password) {
      console.log(
        "[ERROR][POST] wrong data on " + _MemberController.path + " : " + JSON.stringify(req.body)
      );
      res.status(400).send();
      return;
    }
    let user_captain_id = await team_default.get_user_captain_id_by_team_id(team_id);
    let identified = await user_default.identifyUser(user_captain_id, password);
    if (!identified) {
      res.status(401).send("Wrong password!");
      return;
    }
    if (!id) {
      const element = new Member(
        team_id,
        user_id
      );
      _MemberController.post_new(element, res);
    } else {
      const element = new MemberEntry(
        id,
        team_id,
        user_id
      );
      _MemberController.post_modify(element, res);
    }
  }
  async delete(req, res) {
    const db = new import_sqlite39.Database("maggle.db");
    const { id, user_captain_id, password } = req.body;
    if (!id || !user_captain_id || !password) {
      console.log(
        "[ERROR][DELETE] wrong data on " + _MemberController.path + " : " + JSON.stringify(req.body)
      );
    }
    let identified = await user_default.identifyUser(user_captain_id, password);
    if (!identified) {
      res.status(401).send("Wrong password!");
      return;
    }
    const sql = `DELETE FROM member
        WHERE rowid = ?`;
    const data = [id];
    let e;
    db.run(sql, data, (err) => e = err);
    if (e) {
      console.log(
        "[ERROR][DELETE] sql error " + _MemberController.path + " : " + JSON.stringify(id)
      );
      console.error(e.message);
      res.status(500).send();
      return;
    }
    db.close();
    console.log(
      "[INFO][DELETE] data deleted on " + _MemberController.path + " : " + JSON.stringify(id)
    );
    res.status(200).send();
  }
};
var MemberController = _MemberController;
MemberController.path = "/member";
var member_default = MemberController;
var Member = class {
  constructor(team_id, user_id) {
    this.team_id = team_id;
    this.user_id = user_id;
  }
};
var MemberEntry = class {
  constructor(id, team_id, user_id) {
    this.id = id;
    this.team_id = team_id;
    this.user_id = user_id;
  }
};

// src/index.ts
var controllers = [
  new user_default(),
  new student_default(),
  new manager_default(),
  new file_default(),
  new data_challenge_default(),
  new data_project_default(),
  new resource_challenge_default(),
  new resource_project_default(),
  new member_default(),
  new team_default()
];
var app = new app_default(
  controllers,
  8080
);
app.listen();
