import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import UserController from "./user";

class RankController implements Controller {
    static path = "/rank";
    router: Router;

    constructor() {
        this.router = Router();
        this.router.post(RankController.path, this.post);
        this.router.get(RankController.path, this.get_all);
        this.router.get(RankController.path + "/:id", this.get);
        this.router.delete(RankController.path, this.delete);
    }

    static get_values() {
        const db = new Database("maggle.db");
        const sql = "SELECT rowid, * FROM rank";
    
        return new Promise((resolve, reject) =>
          db.all(sql, [], (err, rows) => {
            if (err) {
              console.log(err);
            }
            resolve(rows);
          })
        );
    }

    async get_all(req: Request, res: Response) {
        let r = new Array<RankEntry>();
    
        await RankController.get_values().then((rows: any) =>
            rows.forEach((row) => {
                r.push(new RankEntry(
                    row.rowid,
                    row.data_project_id,
                    row.team_id,
                    row.score
                ))
            })
        )
        res.send(JSON.stringify(r));
    }

    async get(req: Request, res: Response) {
        let id = req.params.id
        let r;
        
        let found = false;
        await RankController.get_values().then((rows: any) =>
            rows.forEach((row) => {
                if (row.rowid == id) {
                    found = true;
                    r = new RankEntry(
                        row.rowid,
                        row.data_project_id,
                        row.team_id,
                        row.score
                    );
                }
            })
        )
        
        if (found) {
            console.log(
              "[INFO][POST] " + RankController.path + ": " + id,
            );
            res.send(JSON.stringify(r));
        } else {
            res.status(400).send();
        }
    }

    static async post_new(p: Rank, res: Response) {
        let sql;
        let data;
        const db = new Database("maggle.db");
        
        sql = "INSERT INTO rank VALUES(?, ?, ?)";
        data = [
          p.data_project_id,
          p.team_id,
          p.score
        ];
    
        /* Run query */
        let e;
        db.run(sql, data, function (err) {
          if (err) {
            console.log(
              "[ERROR][POST] sql error " + RankController.path + " : " +
                JSON.stringify(p),
            );
            console.error(e.message);
            res.status(500).send();
            return;
          }
    
          console.log(
            "[INFO][POST] data added on " + RankController.path + " : " +
              JSON.stringify(p),
          );
      
          res.status(200).send(JSON.stringify({"id":this.lastID}));
        });
        db.close();
    }

    static async post_modify(p: RankEntry, res: Response) {
        const db = new Database("maggle.db");

        const sql = `UPDATE rank SET
        data_project_id = ?, team_id = ?, score = ?
        WHERE rowid = ?`;
        const data = [
            p.data_project_id,
            p.team_id,
            p.score,
            p.id
        ];

        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
            console.log(
            "[ERROR][POST] sql error " + RankController.path + " : " +
                JSON.stringify(p),
            );
            console.error(e.message);
            res.status(500).send();
            return;
        }
        db.close();

        console.log(
            "[INFO][POST] data updated on " + RankController.path + " : " +
            JSON.stringify(p),
        );
        res.status(200).send();
    }

    async post(req: Request, res: Response) {
        let { id, data_project_id, team_id, score,  password } = req.body;

        if (
            !data_project_id || !team_id || !score || !password
        ) {
            console.log(
            "[ERROR][POST] wrong data on " + RankController.path + " : " +
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
            const element: Rank = new Rank(
            data_project_id,
            team_id,
            score
            );
            RankController.post_new(element, res);
        } else {
            const element: RankEntry = new RankEntry(
            id,
            data_project_id,
            team_id,
            score
            );
            RankController.post_modify(element, res);
        }
    }

    async delete(req: Request, res: Response) {
        const db = new Database("maggle.db");
        const { id, password } = req.body;
    
        if ( !id || !password ) {
          console.log(
            "[ERROR][DELETE] wrong data on " + RankController.path + " : " +
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
    
        const sql = `DELETE FROM rank
        WHERE rowid = ?`;
        const data = [id];
    
        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
          console.log(
            "[ERROR][DELETE] sql error " + RankController.path + " : " +
              JSON.stringify(id),
          );
          console.error(e.message);
          res.status(500).send();
          return;
        }
        db.close();
    
        console.log(
          "[INFO][DELETE] data deleted on " + RankController.path + " : " +
            JSON.stringify(id),
        );
        res.status(200).send();
    }
}


export default RankController

class Rank {
    data_project_id: number;
    team_id: number;
    score: number;

    constructor(
        data_project_id: number,
        team_id: number,
        score: number
    ) {
        this.data_project_id = data_project_id;
        this.team_id = team_id;
        this.score = score;
    }
}

class RankEntry {
    id: number;
    data_project_id: number;
    team_id: number;
    score: number;

    constructor(
        id: number,
        data_project_id: number,
        team_id: number,
        score: number
    ) {
        this.id = id;
        this.data_project_id = data_project_id;
        this.team_id = team_id;
        this.score = score;
    }
}