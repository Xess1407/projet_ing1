import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import UserController from "./user";
import TeamController from "./team";

class MemberController implements Controller {
    static path = "/member";
    router: Router;

    constructor() {
        this.router = Router();
        this.router.post(MemberController.path, this.post);
        this.router.get(MemberController.path, this.get_all);
        this.router.get(MemberController.path + "/team/:team_id", this.get);
        this.router.get(MemberController.path + "/user/:user_id", this.get_user_teams_members);
        this.router.delete(MemberController.path, this.delete);
    }
    
    static get_values() {
        const db = new Database("maggle.db");
        const sql = "SELECT rowid, * FROM member";
    
        return new Promise((resolve, reject) =>
          db.all(sql, [], (err, rows) => {
            if (err) {
              console.log(err);
            }
            resolve(rows);
          })
        );
    }

    static async get_user_teams_id(user_id: number): Promise<number[]> {
      /* Get all teams id of the user */
        let teams_id = new Array<number>();
      await MemberController.get_values().then((rows: any) => {
        rows.forEach((row) => {
          if (row.user_id == user_id) teams_id.push(row.team_id)
        })
      })

      // On supprime les doublons
      teams_id = Array.from(new Set(teams_id));

      return teams_id;
    }

    async get_user_teams_members(req: Request, res: Response) {
      let id = parseInt(req.params.user_id);
  
      let r = new Array<MemberEntry>;
  
      if (!id) {
        console.log (
          "[ERROR][GET] wrong data on " + MemberController.path + "/" + id + ": " +
            JSON.stringify(req.body),
        );
        res.status(400).send();
        return;
      }

      let teams_id = await MemberController.get_user_teams_id(id);
  
      let found = false;
      await MemberController.get_values().then((rows: any) =>
          rows.forEach((row) => {
              if (teams_id.includes(row.team_id)) {
                  found = true;
                  r.push(new MemberEntry(
                      row.rowid,
                      row.team_id,
                      row.user_id
                  ));
              }
          })
      );
  
      if (found) {
        console.log(
          "[INFO][GET] " + MemberController.path + "/" + id + ": ",
        );
        res.send(JSON.stringify(r));
      } else {
        res.status(400).send();
      }
  }

    async get(req: Request, res: Response) {
        let id = req.params.team_id;
    
        let r = new Array<MemberEntry>;
    
        if (!id) {
          console.log (
            "[ERROR][GET] wrong data on " + MemberController.path + "/" + id + ": " +
              JSON.stringify(req.body),
          );
          res.status(400).send();
          return;
        }
    
        let found = false;
        await MemberController.get_values().then((rows: any) =>
            rows.forEach((row) => {
                if (row.team_id == id) {
                    found = true;
                    r.push(new MemberEntry(
                        row.rowid,
                        row.team_id,
                        row.user_id
                    ));
                }
            })
        );
    
        if (found) {
          console.log(
            "[INFO][GET] " + MemberController.path + "/" + id + ": ",
          );
          res.send(JSON.stringify(r));
        } else {
          res.status(400).send();
        }
    }

    async get_all(req: Request, res: Response) {
        let r = new Array<MemberEntry>;
    
        await MemberController.get_values().then((rows: any) =>
            rows.forEach((row) => {
                r.push(new MemberEntry(
                    row.rowid,
                    row.team_id,
                    row.user_id
                ));
            })
        );
    
        console.log(
        "[INFO][GET] " + MemberController.path + ": ",
        );
        res.send(JSON.stringify(r));
    }

    static async exist_team_member(p: Member): Promise<boolean> {
        let res = false;
        const db = new Database("maggle.db");
        const sql = "SELECT rowid, * FROM member WHERE team_id = ? AND user_id = ?";

        let params = [p.team_id, p.user_id];

        db.all(sql, params, (err, rows) => {
            if (err) {
                console.log(err);
            }
            if (rows.length > 1) res = true
        });

        db.close();
        return res;
      }

    static async post_new(p: Member, res: Response) {
        let sql;
        let data;
        const db = new Database("maggle.db");
    
        const exist_user = await UserController.exist_user_id(p.user_id);
        if (!exist_user) {
          res.status(400).send("[POST][NEW] User doesn't exist!");
          return;
        }
    
        const exist_team_member = await this.exist_team_member(p)
        if (exist_team_member) {
          res.status(400).send("[POST][NEW] User already exist in this team!");
          return;
        }
        
        /* Define query */
        sql = "INSERT INTO member VALUES(?,?)";
        data = [
          p.team_id,
          p.user_id
        ];
        
        /* Run query */
        db.run(sql, data, function (err) {
          if (err) {
            console.log(
              "[ERROR][POST] sql error " + MemberController.path + " : " +
                JSON.stringify(p),
            );
            console.error(err.message);
            res.status(500).send();
            return;
          }
    
          console.log(
            "[INFO][POST] data added on " + MemberController.path + " : " +
              JSON.stringify(p),
          );
      
          res.status(200).send(JSON.stringify({"id":this.lastID}));
        });
        db.close();
    }

      static async post_modify(p: MemberEntry, res: Response) {
        const db = new Database("maggle.db");
    
        const exist_user = await UserController.exist_user_id(p.user_id);
        if (!exist_user) {
          res.status(400).send("[POST][MODIFY] User doesn't exist!");
          return;
        }

        /* Check exist team */
        const exist_team = await TeamController.exist_team_id(p.team_id);
        if (!exist_team) {
            res.status(400).send("[POST][MODIFY] User doesn't exist!");
            return;
        }
    
        const sql = `UPDATE member SET
        team_id = ?, user_id = ?
        WHERE rowid = ?`;
        const data = [
          p.team_id,
          p.user_id,
          p.id
        ];
    
        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
          console.log(
            "[ERROR][POST] sql error " + MemberController.path + " : " +
              JSON.stringify(p),
          );
          console.error(e.message);
          res.status(500).send();
          return;
        }
        db.close();
    
        console.log(
          "[INFO][POST] data updated on " + MemberController.path + " : " +
            JSON.stringify(p),
        );
        res.status(200).send();
    }

    async post(req: Request, res: Response) {
        let { id, team_id, user_id, password } = req.body;
    
        if (!user_id || !team_id || !password) {
          console.log(
            "[ERROR][POST] wrong data on " + MemberController.path + " : " +
              JSON.stringify(req.body),
          );
          res.status(400).send();
          return;
        }
    
        /* Check identifiers */
        let user_captain_id = await TeamController.get_user_captain_id_by_team_id(team_id);
        let identified = await UserController.identifyUser(user_captain_id, password);
        if (!identified) {
          res.status(401).send("Wrong password!");
          return;
        }
        
    
        /* No ID of student implie creating the user otherwise modify it */
        if (!id) {
          const element: Member = new Member(
            team_id,
            user_id
          );
          MemberController.post_new(element, res);
        } else {
          /* Get the rowid of the student with the password */
          const element: MemberEntry = new MemberEntry(
            id,
            team_id,
            user_id
          );
          MemberController.post_modify(element, res);
        }
    }

    async delete(req: Request, res: Response) {
        const db = new Database("maggle.db");
        const { id, user_captain_id, password } = req.body;
    
        if ( !id || !user_captain_id || !password ) {
          console.log(
            "[ERROR][DELETE] wrong data on " + MemberController.path + " : " +
              JSON.stringify(req.body),
          );
          res.status(400).send();
          return;
        }

        /* Check identifiers */
        let identified = await UserController.identifyUser(user_captain_id, password);
        if (!identified) {
          res.status(401).send("Wrong password!");
          return;
        }
        
    
        const sql = `DELETE FROM member
        WHERE rowid = ?`;
        const data = [id];
    
        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
          console.log(
            "[ERROR][DELETE] sql error " + MemberController.path + " : " +
              JSON.stringify(id),
          );
          console.error(e.message);
          res.status(500).send();
          return;
        }
        db.close();
    
        console.log(
          "[INFO][DELETE] data deleted on " + MemberController.path + " : " +
            JSON.stringify(id),
        );
        res.status(200).send();
    }
}

export default MemberController

class Member {
    team_id: number;
    user_id: number;

    constructor(
        team_id: number,
        user_id: number
    ) {
        this.team_id = team_id;
        this.user_id = user_id;
    }
}

class MemberEntry {
    id: number;
    team_id: number;
    user_id: number;

    constructor(
        id: number,
        team_id: number,
        user_id: number
    ) {
        this.id = id;
        this.team_id = team_id;
        this.user_id = user_id;
    }
}