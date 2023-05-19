import App from "./app";
import FileController from "./file";
import ManagerController from "./manager";
import StudentController from "./student";
import UserController from "./user";

const controllers = [
  new UserController(),
  new StudentController(),
  new ManagerController(),
  new FileController(),
];

const app = new App(
  controllers,
  8080,
);

app.listen();
