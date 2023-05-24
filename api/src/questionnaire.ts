import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import UserController from "./user";

class QuestionnaireController implements Controller {
    static path = "/questionnaire";
    router: Router;

    constructor() {
        this.router = Router();
        this.router.post(QuestionnaireController.path, this.post);
        this.router.get(QuestionnaireController.path, this.get_all);
        this.router.get(QuestionnaireController.path + "/:id", this.get);
        this.router.delete(QuestionnaireController.path, this.delete);
    }

    static get_values() {
        const db = new Database("maggle.db");
        const sql = "SELECT rowid, * FROM questionnaire";
    
        return new Promise((resolve, reject) =>
          db.all(sql, [], (err, rows) => {
            if (err) {
              console.log(err);
            }
            resolve(rows);
          })
        );
    }

    static async exist_questionnaire_id(questionnaire_id: number) {
        let res = false;
        await QuestionnaireController.get_values().then((rows: any) =>
          rows.forEach((row) => {
            if (row.rowid == questionnaire_id) {
              res = true;
            }
          })
        );
    
        return res;
    }

    async get_all(req: Request, res: Response) {
        let r = new Array<QuestionnaireEntry>();
    
        await QuestionnaireController.get_values().then((rows: any) =>
            rows.forEach((row) => {
                r.push(new QuestionnaireEntry(
                    row.rowid,
                    row.data_project_id,
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
        await QuestionnaireController.get_values().then((rows: any) =>
            rows.forEach((row) => {
                if (row.rowid == id) {
                    found = true;
                    r = new QuestionnaireEntry(
                        row.rowid,
                        row.data_project_id,
                        row.name,
                        row.date_time_start,
                        row.date_time_end
                    );
                }
            })
        )
        
        if (found) {
            console.log(
              "[INFO][POST] " + QuestionnaireController.path + ": " + id,
            );
            res.send(JSON.stringify(r));
        } else {
            res.status(400).send();
        }
    }

    static async post_new(p: Questionnaire, res: Response) {
        let sql;
        let data;
        const db = new Database("maggle.db");
        
        sql = "INSERT INTO questionnaire VALUES(?, ?, ?, ?)";
        data = [
          p.data_project_id,
          p.name,
          p.date_time_start,
          p.date_time_end
        ];
    
        /* Run query */
        db.run(sql, data, function (err) {
          if (err) {
            console.log(
              "[ERROR][POST] sql error " + QuestionnaireController.path + " : " +
                JSON.stringify(p),
            );
            console.error(err.message);
            res.status(500).send();
            return;
          }
    
          console.log(
            "[INFO][POST] data added on " + QuestionnaireController.path + " : " +
              JSON.stringify(p),
          );
      
          res.status(200).send(JSON.stringify({"id":this.lastID}));
        });
        db.close();
    }

    static async post_modify(p: QuestionnaireEntry, res: Response) {
        const db = new Database("maggle.db");

        const sql = `UPDATE questionnaire SET
        data_project_id = ?, name = ?, date_time_start = ?, date_time_end = ?
        WHERE rowid = ?`;
        const data = [
            p.data_project_id,
            p.name,
            p.date_time_start,
            p.date_time_end,
            p.id
        ];

        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
            console.log(
            "[ERROR][POST] sql error " + QuestionnaireController.path + " : " +
                JSON.stringify(p),
            );
            console.error(e.message);
            res.status(500).send();
            return;
        }
        db.close();

        console.log(
            "[INFO][POST] data updated on " + QuestionnaireController.path + " : " +
            JSON.stringify(p),
        );
        res.status(200).send();
    }

    async post(req: Request, res: Response) {
        let { id, data_project_id, name, date_time_start, date_time_end, user_id,  password } = req.body;

        if (
            !data_project_id || !name || !date_time_start || !date_time_end || !user_id || !password
        ) {
            console.log(
            "[ERROR][POST] wrong data on " + QuestionnaireController.path + " : " +
                JSON.stringify(req.body),
            );
            res.status(400).send();
            return;
        }

        /* Check identifiers */
        let identified = await UserController.identifyManager(user_id, password);
        if (!identified) {
          res.status(401).send("Wrong password!");
          return;
        }

        if (!id) {
            const element: Questionnaire = new Questionnaire(
            data_project_id,
            name,
            date_time_start,
            date_time_end
            );
            QuestionnaireController.post_new(element, res);
        } else {
            const element: QuestionnaireEntry = new QuestionnaireEntry(
            id,
            data_project_id,
            name,
            date_time_start,
            date_time_end
            );
            QuestionnaireController.post_modify(element, res);
        }
    }

    async delete(req: Request, res: Response) {
        const db = new Database("maggle.db");
        const { id, user_id, password } = req.body;
    
        if ( !id || !user_id || !password ) {
          console.log(
            "[ERROR][DELETE] wrong data on " + QuestionnaireController.path + " : " +
              JSON.stringify(req.body),
          );
          res.status(400).send();
          return;
        }

        /* Check identifiers */
        let identified = await UserController.identifyManager(user_id, password);
        if (!identified) {
          res.status(401).send("Wrong password!");
          return;
        }
    
        const sql = `DELETE FROM questionnaire
        WHERE rowid = ?`;
        const data = [id];
    
        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
          console.log(
            "[ERROR][DELETE] sql error " + QuestionnaireController.path + " : " +
              JSON.stringify(id),
          );
          console.error(e.message);
          res.status(500).send();
          return;
        }
        db.close();
    
        console.log(
          "[INFO][DELETE] data deleted on " + QuestionnaireController.path + " : " +
            JSON.stringify(id),
        );
        res.status(200).send();
    }

}

export default QuestionnaireController

class Questionnaire {
    data_project_id: number;
    name: string;
    date_time_start: string;
    date_time_end: string;

    constructor(
        data_project_id: number,
        name: string,
        date_time_start: string,
        date_time_end: string
    ) {
        this.data_project_id = data_project_id;
        this.name = name;
        this.date_time_start = date_time_start;
        this.date_time_end = date_time_end
    }
}

class QuestionnaireEntry {
    id: number;
    data_project_id: number;
    name: string;
    date_time_start: string;
    date_time_end: string;

    constructor(
        id: number,
        data_project_id: number,
        name: string,
        date_time_start: string,
        date_time_end: string
    ) {
        this.id = id;
        this.data_project_id = data_project_id;
        this.name = name;
        this.date_time_start = date_time_start;
        this.date_time_end = date_time_end
    }
}