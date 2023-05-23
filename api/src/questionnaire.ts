import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import DataChallengeController from "./data_challenge";
import UserController from "./user";

class QuestionnaireController implements Controller {
    static path = "/resource-challenge";
    router: Router;

    constructor() {
        this.router = Router();
    }
}

export default QuestionnaireController