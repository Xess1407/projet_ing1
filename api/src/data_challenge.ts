import Controller from "./controller";

class DataChallengeController implements Controller {
    static path = "/challenge";
    router: Router;

    constructor() {
        this.router = new Router();
        this.router.post(DataChallengeController.path, this.post);
        this.router.post(DataChallengeController.path + "/get", this.get);
    }
}

export default DataChallengeController;