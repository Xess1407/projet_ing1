import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import UserController from "./user";

class DataChallengeController implements Controller {
    static path = "/challenge";
    router: Router;

    constructor() {
        this.router = Router();
        this.router.post(DataChallengeController.path, this.post);
        this.router.get(DataChallengeController.path, this.get_all);
        this.router.get(DataChallengeController.path + "/:id", this.get);
        this.router.delete(DataChallengeController.path, this.delete);
    }

    static get_values() {
        const db = new Database("maggle.db");
        const sql = "SELECT rowid, * FROM data_challenge";
    
        return new Promise((resolve, reject) =>
          db.all(sql, [], (err, rows) => {
            if (err) {
              console.log(err);
            }
            resolve(rows);
          })
        );
    }

    static async exist_data_challenge(data_challenge_id: number) {
      let res = false;
      await DataChallengeController.get_values().then((rows: any) =>
        rows.forEach((row) => {
          if (row.rowid == data_challenge_id) {
            res = true;
          }
        })
      );
  
      return res;
    }

    async get_all(req: Request, res: Response) {
        let r = new Array<DataChallengeEntry>();
    
        await DataChallengeController.get_values().then((rows: any) =>
            rows.forEach((row) => {
                r.push(new DataChallengeEntry(
                    row.rowid,
                    row.name,
                    row.date_time_start,
                    row.date_time_end
                ))
            })
        )
        res.send(JSON.stringify(r));
    }

    async get(req: Request, res: Response) {
        let id = req.params.id
        let r;
        
        let found = false;
        await DataChallengeController.get_values().then((rows: any) =>
            rows.forEach((row) => {
                if (row.rowid == id) {
                    found = true;
                    r = new DataChallengeEntry(
                        row.rowid,
                        row.name,
                        row.date_time_start,
                        row.date_time_end
                    );
                }
            })
        )
        
        if (found) {
            console.log(
              "[INFO][POST] " + DataChallengeController.path + ": " + id,
            );
            res.send(JSON.stringify(r));
        } else {
            res.status(400).send();
        }
    }
    
    static async post_new(p: DataChallenge, res: Response) {
        let sql;
        let data;
        const db = new Database("maggle.db");
        
        /* Define query */
        sql = "INSERT INTO data_challenge VALUES(?,?,?)";
        data = [
          p.name,
          p.date_time_start,
          p.date_time_end
        ];
        
        /* Run query */
        let e;
        db.run(sql, data, function (err) {
          if (err) {
            console.log(
              "[ERROR][POST] sql error " + DataChallengeController.path + " : " +
                JSON.stringify(p),
            );
            console.error(e.message);
            res.status(500).send();
            return;
          }
    
          console.log(
            "[INFO][POST] data added on " + DataChallengeController.path + " : " +
              JSON.stringify(p),
          );
      
          res.status(200).send(JSON.stringify({"id:":this.lastID}));
        });
        db.close();
    }

    static async post_modify(p: DataChallengeEntry, res: Response) {
        const db = new Database("maggle.db");
    
        const sql = `UPDATE data_challenge SET
        name = ?, date_time_start = ?, date_time_end = ?
        WHERE rowid = ?`;
        const data = [
          p.name,
          p.date_time_start,
          p.date_time_end,
          p.id
        ];
    
        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
          console.log(
            "[ERROR][POST] sql error " + DataChallengeController.path + " : " +
              JSON.stringify(p),
          );
          console.error(e.message);
          res.status(500).send();
          return;
        }
        db.close();
    
        console.log(
          "[INFO][POST] data updated on " + DataChallengeController.path + " : " +
            JSON.stringify(p),
        );
        res.status(200).send();
    }

    async post(req: Request, res: Response) {
        let { id, name, date_time_start, date_time_end, password } = req.body;
    
        if (!name || !date_time_start || !date_time_end || !password) {
          console.log(
            "[ERROR][POST] wrong data on " + DataChallengeController.path + " : " +
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
    
        /* No ID of student implie creating the user otherwise modify it */
        if (!id) {
          const element: DataChallenge = new DataChallenge(
            name,
            date_time_start,
            date_time_end
          );
          DataChallengeController.post_new(element, res);
        } else {
          /* Get the rowid of the student with the password */
          const element: DataChallengeEntry = new DataChallengeEntry(
            id,
            name,
            date_time_start,
            date_time_end
          );
          DataChallengeController.post_modify(element, res);
        }
    }

    async delete(req: Request, res: Response) {
        const db = new Database("maggle.db");
        const { id, password } = req.body;
    
        if ( !id || !password ) {
          console.log(
            "[ERROR][DELETE] wrong data on " + DataChallengeController.path + " : " +
              JSON.stringify(req.body),
          );
        }

        /* Check identifiers */
        let identified = false;
        await UserController.get_values().then((rows: any) =>
        rows.forEach((row) => {
            if (row.role == "admin" && row.password == password) {
              identified = true;
            }
          })
        )
        if (!identified) {
          res.status(401).send("Wrong password!");
          return;
        }
    
        const sql = `DELETE FROM data_challenge
        WHERE rowid = ?`;
        const data = [id];
    
        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
          console.log(
            "[ERROR][DELETE] sql error " + DataChallengeController.path + " : " +
              JSON.stringify(id),
          );
          console.error(e.message);
          res.status(500).send();
          return;
        }
        db.close();
    
        console.log(
          "[INFO][DELETE] data deleted on " + DataChallengeController.path + " : " +
            JSON.stringify(id),
        );
        res.status(200).send();
      }
}

export default DataChallengeController;

class DataChallenge {
    name: string;
    date_time_start: string;
    date_time_end: string;
  
    constructor(name: string, date_time_start: string, date_time_end: string ) {
        this.name = name;
        this.date_time_start = date_time_start;
        this.date_time_end = date_time_end;
    }
  }
  
  class DataChallengeEntry {
    id: number;
    name: string;
    date_time_start: string;
    date_time_end: string;
  
    constructor(
      id: number,
      name: string,
      date_time_start: string,
      date_time_end: string
    ) {
      this.id = id;
      this.name = name;
      this.date_time_start = date_time_start;
      this.date_time_end = date_time_end;
    }
  }
  