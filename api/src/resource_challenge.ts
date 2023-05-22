import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import DataChallengeController from "./data_challenge";

class ResourceChallengeController implements Controller {
    static path = "/resource-challenge";
    router: Router;

    /*
    constructor() {
        this.router = new Router();
        this.router.post(ResourceController.path, this.post);
        this.router.get(ResourceController.path, this.get_all);
        this.router.get(ResourceController.path + "/:id", this.get);
        this.router.delete(ResourceController.path, this.delete);
    }
    */
}

export default ResourceChallengeController