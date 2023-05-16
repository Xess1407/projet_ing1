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

// src/index.ts
var controllers = [];
var app = new app_default(
  controllers,
  8080
);
app.listen();
