import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import DataChallengeController from "./data_challenge";
import UserController from "./user";
import DataProjectController from "./data_project";

class ResourceChallengeController implements Controller {
    static path = "/resource-challenge";
    router: Router;

    constructor() {
        this.router = Router();
        this.router.post(ResourceChallengeController.path, this.post);
        this.router.get(ResourceChallengeController.path, this.get_all);
        this.router.get(ResourceChallengeController.path + "/:id", this.get);
        this.router.delete(ResourceChallengeController.path, this.delete);
    }
    
    static get_values() {
        const db = new Database("maggle.db");
        const sql = "SELECT rowid, * FROM resource_challenge";
    
        return new Promise((resolve, reject) =>
          db.all(sql, [], (err, rows) => {
            if (err) {
              console.log(err);
            }
            resolve(rows);
          })
        );
    }

    async get(req: Request, res: Response) {
        let id = req.params.id;
    
        let r;
    
        if (!id) {
          console.log (
            "[ERROR][GET] wrong data on " + ResourceChallengeController.path + "/" + id + ": " +
              JSON.stringify(req.body),
          );
          res.status(400).send();
          return;
        }
    
        let found = false;
        await ResourceChallengeController.get_values().then((rows: any) =>
            rows.forEach((row) => {
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
            "[INFO][GET] " + ResourceChallengeController.path + "/" + id + ": ",
          );
          res.send(JSON.stringify(r));
        } else {
          res.status(400).send();
        }
    }

    async get_all(req: Request, res: Response) {
        let r = new Array<ResourceChallengeEntry>;
    
        await ResourceChallengeController.get_values().then((rows: any) =>
            rows.forEach((row) => {
                r.push(new ResourceChallengeEntry(
                    row.rowid,
                    row.data_challenge_id,
                    row.name,
                    row.url
                ));
            })
        );
    
        console.log(
        "[INFO][GET] " + ResourceChallengeController.path + ": ",
        );
        res.send(JSON.stringify(r));
    }

    static async post_new(p: ResourceChallenge, res: Response) {
        let sql;
        let data;
        const db = new Database("maggle.db");
    
        const exist = await DataChallengeController.exist_data_challenge(p.data_challenge_id);
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
            "[ERROR][POST] sql error " + ResourceChallengeController.path + " : " +
              JSON.stringify(p),
          );
          console.error(e.message);
          res.status(500).send();
          return;
        }
        db.close();
    
        console.log(
          "[INFO][POST] data added on " + ResourceChallengeController.path + " : " +
            JSON.stringify(p),
        );
        res.status(200).send();
    }

    static async post_modify(p: ResourceChallengeEntry, res: Response) {
        const db = new Database("maggle.db");

        const exist = await DataChallengeController.exist_data_challenge(p.data_challenge_id);
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
            "[ERROR][POST] sql error " + ResourceChallengeController.path + " : " +
                JSON.stringify(p),
            );
            console.error(e.message);
            res.status(500).send();
            return;
        }
        db.close();

        console.log(
            "[INFO][POST] data updated on " + ResourceChallengeController.path + " : " +
            JSON.stringify(p),
        );
        res.status(200).send();
    }

    async post(req: Request, res: Response) {
        let { id, data_challenge_id, name, url, password } = req.body;

        if (
            !data_challenge_id || !name || !url || !password
        ) {
            console.log(
            "[ERROR][POST] wrong data on " + ResourceChallengeController.path + " : " +
                JSON.stringify(req.body),
            );
            res.status(400).send();
            return;
        }

        /* Check identifiers */
        let identified = await UserController.identifyAdmin(password);
        if (!identified) {
          res.status(401).send("Wrong password!");
          return;
        }

        if (!id) {
            const element: ResourceChallenge = new ResourceChallenge(
            data_challenge_id,
            name,
            url
            );
            ResourceChallengeController.post_new(element, res);
        } else {
            const element: ResourceChallengeEntry = new ResourceChallengeEntry(
            id,
            data_challenge_id,
            name,
            url,
            );
            ResourceChallengeController.post_modify(element, res);
        }
    }

    async delete(req: Request, res: Response) {
        const db = new Database("maggle.db");
        const { id, password } = req.body;
    
        if ( !id || !password ) {
          console.log(
            "[ERROR][DELETE] wrong data on " + ResourceChallengeController.path + " : " +
              JSON.stringify(req.body),
          );
          res.status(400).send();
          return;
        }

        /* Check identifiers */
        let identified = await UserController.identifyAdmin(password);
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
            "[ERROR][DELETE] sql error " + ResourceChallengeController.path + " : " +
              JSON.stringify(id),
          );
          console.error(e.message);
          res.status(500).send();
          return;
        }
        db.close();
    
        console.log(
          "[INFO][DELETE] data deleted on " + ResourceChallengeController.path + " : " +
            JSON.stringify(id),
        );
        res.status(200).send();
    }

}

export default ResourceChallengeController

class ResourceChallenge {
    data_challenge_id: number;
    name: string;
    url: string;

    constructor(
        data_challenge_id: number,
        name: string,
        url: string
    ) {
        this.data_challenge_id = data_challenge_id;
        this.name = name;
        this.url = url;
    }
}

class ResourceChallengeEntry {
    id: number;
    data_challenge_id: number;
    name: string;
    url: string;

    constructor(
        id: number,
        data_challenge_id: number,
        name: string,
        url: string
    ) {
        this.id = id;
        this.data_challenge_id = data_challenge_id;
        this.name = name;
        this.url = url;
    }
}