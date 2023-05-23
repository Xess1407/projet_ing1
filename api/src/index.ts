import App from "./app";
import FileController from "./file";
import ManagerController from "./manager";
import StudentController from "./student";
import UserController from "./user";
import DataChallengeController from "./data_challenge"
import DataProjectController from "./data_project"
import ResourceChallengeController from "./resource_challenge"
import ResourceProjectController from "./resource_project";
import MemberController from "./member";
import TeamController from "./team";
import QuestionnaireController from "./questionnaire";
import QuestionController from "./question";
import AnswerController from "./answer";
import RankController from "./rank";
import MessageController from "./message";

const controllers = [
  new UserController(),
  new StudentController(),
  new ManagerController(),
  new FileController(),
  new DataChallengeController(),
  new DataProjectController(),
  new ResourceChallengeController(),
  new ResourceProjectController(),
  new MemberController(),
  new TeamController(),
  new QuestionnaireController(),
  new QuestionController(),
  new AnswerController(),
  new RankController(),
  new MessageController(),
];

const app = new App(
  controllers,
  8080,
);

app.listen();
