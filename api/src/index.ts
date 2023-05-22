import App from "./app";
import FileController from "./file";
import ManagerController from "./manager";
import StudentController from "./student";
import UserController from "./user";
import DataChallengeController from "./data_challenge"

const controllers = [
  new UserController(),
  new StudentController(),
  new ManagerController(),
  new FileController(),
  new DataChallengeController(),
  //new DataProjectController(),
];

const app = new App(
  controllers,
  8080,
);

app.listen();
