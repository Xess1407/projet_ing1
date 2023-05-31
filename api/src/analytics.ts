import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";

class AnalyticsController implements Controller {
    static path = "/analytics";
    router: Router;

    constructor() {
        this.router = Router();
        this.router.post(AnalyticsController.path, this.post);
        this.router.post(AnalyticsController.path + "/get", this.get);
        this.router.get(AnalyticsController.path + "/:user_id", this.get_all_by_user_id);
        this.router.delete(AnalyticsController.path, this.delete);
    }

    static get_values() {
        const db = new Database("maggle.db");
        const sql = "SELECT rowid, * FROM analytics";
    
        return new Promise((resolve, reject) =>
          db.all(sql, [], (err, rows) => {
            if (err) {
              console.log(err);
            }
            resolve(rows);
          })
        );
    }

    async get_all_by_user_id(req: Request, res: Response) {
        let user_id = req.params.user_id;

        let r = new Array<AnalyticsEntry>();
    
        await AnalyticsController.get_values().then((rows: any) =>
            rows.forEach((row) => {
                if(row.user_id == user_id) {
                    r.push(new AnalyticsEntry(
                        row.rowid,
                        row.data_project_id,
                        row.user_id,
                        row.file_name,
                        row.json_data
                    ))
                }
            })
        )
        res.send(JSON.stringify(r));
    }

    async get(req: Request, res: Response) {
        let { data_project_id, user_id } = req.body;

        let r = new Array<AnalyticsEntry>;

        if (!data_project_id || !user_id) {
            console.log (
                "[ERROR][POST] wrong data on " + AnalyticsController.path + "/get: " +
                JSON.stringify(req.body),
            );
            res.status(400).send();
            return;
        }

        let found = false;

        await AnalyticsController.get_values().then((rows: any) =>
            rows.forEach((row) => {
            if (row.data_project_id == data_project_id && row.user_id == user_id) {
                found = true;
                r.push(new AnalyticsEntry(
                    row.rowid,
                    row.data_project_id,
                    row.user_id,
                    row.file_name,
                    row.json_data
                ));
            }
            })
        );

        if (found) {
            console.log(
                "[INFO][POST] " + AnalyticsController.path + "/get: ",
            );
            res.send(JSON.stringify(r));
        } else {
            res.status(400).send();
        }
    }

    static async post_new(p: Analytics, res: Response) {
        let sql;
        let data;
        const db = new Database("maggle.db");
        
        sql = "INSERT INTO analytics VALUES(?, ?, ?, ?)";
        data = [
          p.data_project_id,
          p.user_id,
          p.file_name,
          p.json_data
        ];
    
        /* Run query */
        let e;
        db.run(sql, data, function (err) {
          if (err) {
            console.log(
              "[ERROR][POST] sql error " + AnalyticsController.path + " : " +
                JSON.stringify(p),
            );
            console.error(e.message);
            res.status(500).send();
            return;
          }
    
          console.log(
            "[INFO][POST] data added on " + AnalyticsController.path + " : " +
              JSON.stringify(p),
          );
      
          res.status(200).send(JSON.stringify({"id":this.lastID}));
        });
        db.close();
    }

    static async post_modify(p: AnalyticsEntry, res: Response) {
        const db = new Database("maggle.db");

        const sql = `UPDATE analytics SET
        data_project_id = ?, user_id = ?, file_name = ?, json_data = ?
        WHERE rowid = ?`;
        const data = [
            p.data_project_id,
            p.user_id,
            p.file_name,
            p.json_data,
            p.id
        ];

        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
            console.log(
            "[ERROR][POST] sql error " + AnalyticsController.path + " : " +
                JSON.stringify(p),
            );
            console.error(e.message);
            res.status(500).send();
            return;
        }
        db.close();

        console.log(
            "[INFO][POST] data updated on " + AnalyticsController.path + " : " +
            JSON.stringify(p),
        );
        res.status(200).send();
    }

    async post(req: Request, res: Response) {
        let { id, data_project_id, user_id, file_name, json_data } = req.body;

        if (
            !data_project_id || !user_id || !file_name || !json_data
        ) {
            console.log(
            "[ERROR][POST] wrong data on " + AnalyticsController.path + " : " +
                JSON.stringify(req.body),
            );
            res.status(400).send();
            return;
        }

        if (!id) {
            const element: Analytics = new Analytics(
            data_project_id,
            user_id,
            file_name,
            json_data
            );
            AnalyticsController.post_new(element, res);
        } else {
            const element: AnalyticsEntry = new AnalyticsEntry(
            id,
            data_project_id,
            user_id,
            file_name,
            json_data
            );
            AnalyticsController.post_modify(element, res);
        }
    }

    async delete(req: Request, res: Response) {
        const db = new Database("maggle.db");
        const { id } = req.body;
    
        if ( !id ) {
          console.log(
            "[ERROR][DELETE] wrong data on " + AnalyticsController.path + " : " +
              JSON.stringify(req.body),
          );
          res.status(400).send();
          return;
        }
    
        const sql = `DELETE FROM analytics
        WHERE rowid = ?`;
        const data = [id];
    
        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
          console.log(
            "[ERROR][DELETE] sql error " + AnalyticsController.path + " : " +
              JSON.stringify(id),
          );
          console.error(e.message);
          res.status(500).send();
          return;
        }
        db.close();
    
        console.log(
          "[INFO][DELETE] data deleted on " + AnalyticsController.path + " : " +
            JSON.stringify(id),
        );
        res.status(200).send();
    }
}


export default AnalyticsController

class Analytics {
    data_project_id: number;
    user_id: number;
    file_name: string;
    json_data: string;

    constructor(
        data_project_id: number,
        user_id: number,
        file_name: string,
        json_data: string
    ) {
        this.data_project_id = data_project_id;
        this.user_id = user_id;
        this.file_name = file_name;
        this.json_data = json_data;
    }
}

class AnalyticsEntry {
    id: number;
    data_project_id: number;
    user_id: number;
    file_name: string;
    json_data: string;

    constructor(
        id: number,
        data_project_id: number,
        user_id: number,
        file_name: string,
        json_data: string
    ) {
        this.id = id;
        this.data_project_id = data_project_id;
        this.user_id = user_id;
        this.file_name = file_name;
        this.json_data = json_data;
    }
}