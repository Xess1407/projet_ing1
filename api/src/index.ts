import App from "./app";
import ManagerController from "./manager";
import StudentController from "./student";
import UserController from "./user";

const controllers = [
  new UserController(),
  new StudentController(),
  new ManagerController(),
];

const app = new App(
  controllers,
  8080,
);

app.listen();
