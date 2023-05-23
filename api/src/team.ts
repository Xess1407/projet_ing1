import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import DataChallengeController from "./data_challenge";
import UserController from "./user";

class TeamController implements Controller {
    static path = "/team";
    router: Router;

    constructor() {
        this.router = new Router();
        this.router.post(TeamController.path, this.post);
        this.router.get(TeamController.path, this.get_all);
        this.router.get(TeamController.path + "/:id", this.get);
        this.router.delete(TeamController.path, this.delete);
    }

    static get_values() {
        const db = new Database("maggle.db");
        const sql = "SELECT rowid, * FROM team";
    
        return new Promise((resolve, reject) =>
          db.all(sql, [], (err, rows) => {
            if (err) {
              console.log(err);
            }
            resolve(rows);
          })
        );
    }

    static async exist_team_id(team_id: number): bool {
        let res = false;
        await TeamController.get_values().then((rows: any) =>
          rows.forEach((row) => {
            if (row.rowid == team_id) {
              res = true;
            }
          })
        );
    
        return res;
    }

    static get_user_captain_id_by_team_id(team_id: number) {
        const db = new Database("maggle.db");
        const sql = "SELECT user_captain_id FROM team WHERE rowid = ?";
    
        let params = [team_id];
    
        return new Promise((resolve, reject) =>
          db.get(sql, params, (err, row: TeamEntry) => {
            if (err) {
              console.log(err);
            }
            resolve(row.user_captain_id);
          })
        );
    }

    async get(req: Request, res: Response) {
        let id = req.params.id;
    
        let r;
    
        if (!id) {
          console.log (
            "[ERROR][GET] wrong data on " + TeamController.path + "/" + id + ": " +
              JSON.stringify(req.body),
          );
          res.status(400).send();
          return;
        }
    
        let found = false;
        await TeamController.get_values().then((rows: any) =>
        rows.forEach((row) => {
            if (row.rowid == id) {
            found = true;
            r = new TeamEntry(
                row.rowid,
                row.user_captain_id,
                row.data_project_id
            );
            }
        })
        );
    
        if (found) {
          console.log(
            "[INFO][GET] " + TeamController.path + "/" + id + ": ",
          );
          res.send(JSON.stringify(r));
        } else {
          res.status(400).send();
        }
    }

    async get_all(req: Request, res: Response) {
        let r = new Array<TeamEntry>;
    
        await TeamController.get_values().then((rows: any) =>
            rows.forEach((row) => {
                r.push(new TeamEntry(
                    row.rowid,
                    row.user_captain_id,
                    row.data_project_id
                ));
            })
        );
    
        console.log(
        "[INFO][GET] " + TeamController.path + ": ",
        );
        res.send(JSON.stringify(r));
    }

    static async post_new(p: Team, res: Response) {
        let sql;
        let data;
        const db = new Database("maggle.db");
        
        sql = "INSERT INTO team VALUES(?,?)";
        data = [
          p.user_captain_id,
          p.data_project_id
        ];
    
        /* Run query */
        let e;
        db.run(sql, data, function (err) {
          if (err) {
            console.log(
              "[ERROR][POST] sql error " + TeamController.path + " : " +
                JSON.stringify(p),
            );
            console.error(e.message);
            res.status(500).send();
            return;
          }
    
          console.log(
            "[INFO][POST] data added on " + TeamController.path + " : " +
              JSON.stringify(p),
          );
      
          res.status(200).send(JSON.stringify({"id:":this.lastID}));
        });
        db.close();
    }
    
    static async post_modify(p: TeamEntry, res: Response) {
        const db = new Database("maggle.db");

        const sql = `UPDATE team SET
        user_captain_id = ?, data_project_id = ?
        WHERE rowid = ?`;
        const data = [
            p.user_captain_id,
            p.data_project_id,
            p.id
        ];

        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
            console.log(
            "[ERROR][POST] sql error " + TeamController.path + " : " +
                JSON.stringify(p),
            );
            console.error(e.message);
            res.status(500).send();
            return;
        }
        db.close();

        console.log(
            "[INFO][POST] data updated on " + TeamController.path + " : " +
            JSON.stringify(p),
        );
        res.status(200).send();
    }

    async post(req: Request, res: Response) {
        let { id, email, data_project_id, password } = req.body;

        if (
            !email || !data_project_id || !password
        ) {
            console.log(
            "[ERROR][POST] wrong data on " + TeamController.path + " : " +
                JSON.stringify(req.body),
            );
            res.status(400).send();
            return;
        }

        /* Check identifiers */
        let user_captain_id;
        let identified = false;
        await UserController.get_values().then((rows: any) =>
        rows.forEach((row) => {
            if (row.role == "student" && row.email == email && row.password == password) {
              identified = true;
              user_captain_id = row.rowid;
            }
          })
        )
        if (!identified) {
          res.status(401).send("Wrong password!");
          return;
        }

        if (!id) {
            const element: Team = new Team(
            user_captain_id,
            data_project_id
            );
            TeamController.post_new(element, res);
        } else {
            const element: TeamEntry = new TeamEntry(
            id,
            user_captain_id,
            data_project_id
            );
            TeamController.post_modify(element, res);
        }
    }

    async delete(req: Request, res: Response) {
        const db = new Database("maggle.db");
        const { id, email, password } = req.body;
    
        if ( !id || !password ) {
          console.log(
            "[ERROR][DELETE] wrong data on " + TeamController.path + " : " +
              JSON.stringify(req.body),
          );
        }

        /* Check identifiers */
        let identified = false;
        await UserController.get_values().then((rows: any) =>
        rows.forEach((row) => {
            if (row.role == "student" && row.email == email && row.password == password) {
              identified = true;
            }
          })
        )
        if (!identified) {
          res.status(401).send("Wrong password!");
          return;
        }
    
        const sql = `DELETE FROM team
        WHERE rowid = ?`;
        const data = [id];
    
        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
          console.log(
            "[ERROR][DELETE] sql error " + TeamController.path + " : " +
              JSON.stringify(id),
          );
          console.error(e.message);
          res.status(500).send();
          return;
        }
        db.close();
    
        console.log(
          "[INFO][DELETE] data deleted on " + TeamController.path + " : " +
            JSON.stringify(id),
        );
        res.status(200).send();
    }
}

export default TeamController;

class Team {
    user_captain_id: number;
    data_project_id: number;

    constructor(
        user_captain_id: number,
        data_project_id: number
    ) {
        this.user_captain_id = user_captain_id;
        this.data_project_id = data_project_id;
    }
}

class TeamEntry {
    id: number;
    user_captain_id: number;
    data_project_id: number;

    constructor(
        id: number,
        user_captain_id: number,
        data_project_id: number
    ) {
        this.id = id;
        this.user_captain_id = user_captain_id;
        this.data_project_id = data_project_id;
    }
}