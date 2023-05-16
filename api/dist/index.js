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
      console.log(`[INFO] Project Api started on port ${this.port}`);
      this.app.use("/", import_express.default.static("../front/dist/"));
      this.app.get("*", function(_req, res) {
        res.redirect("/");
      });
    });
  }
};
var app_default = App;

// src/user.ts
var import_express2 = require("express");
var import_sqlite3 = require("sqlite3");
var _UserController = class {
  constructor() {
    this.router = new import_express2.Router();
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
  static async post_new(p, res, id) {
    let sql;
    let data;
    const db = new import_sqlite3.Database("maggle.db");
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

// src/index.ts
var controllers = [
  new user_default()
];
var app = new app_default(
  controllers,
  8080
);
app.listen();
