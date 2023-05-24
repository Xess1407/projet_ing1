import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import UserController from "./user";
import QuestionnaireController from "./questionnaire";

class QuestionController implements Controller {
    static path = "/question";
    router: Router;

    constructor() {
        this.router = Router();
        this.router.post(QuestionController.path, this.post);
        this.router.get(QuestionController.path, this.get_all);
        this.router.get(QuestionController.path + "/:id", this.get);
        this.router.delete(QuestionController.path, this.delete);
    }
    
    static get_values() {
        const db = new Database("maggle.db");
        const sql = "SELECT rowid, * FROM question";
    
        return new Promise((resolve, reject) =>
          db.all(sql, [], (err, rows) => {
            if (err) {
              console.log(err);
            }
            resolve(rows);
          })
        );
    }

    static async exist_question_id(question_id: number) {
        let res = false;
        await QuestionController.get_values().then((rows: any) =>
          rows.forEach((row) => {
            if (row.rowid == question_id) {
              res = true;
            }
          })
        );
    
        return res;
    }

    async get(req: Request, res: Response) {
        let id = req.params.id;
    
        let r = new Array<QuestionEntry>;
    
        if (!id) {
          console.log (
            "[ERROR][GET] wrong data on " + QuestionController.path + "/" + id + ": " +
              JSON.stringify(req.body),
          );
          res.status(400).send();
          return;
        }
    
        let found = false;
        await QuestionController.get_values().then((rows: any) =>
            rows.forEach((row) => {
                if (row.questionnaire_id == id) {
                    found = true;
                    r.push(new QuestionEntry(
                        row.rowid,
                        row.questionnaire_id,
                        row.name
                    ));
                }
            })
        );
    
        if (found) {
          console.log(
            "[INFO][GET] " + QuestionController.path + "/" + id + ": ",
          );
          res.send(JSON.stringify(r));
        } else {
          res.status(400).send();
        }
    }

    async get_all(req: Request, res: Response) {
        let r = new Array<QuestionEntry>;
    
        await QuestionController.get_values().then((rows: any) =>
            rows.forEach((row) => {
                r.push(new QuestionEntry(
                    row.rowid,
                    row.questionnaire_id,
                    row.name
                ));
            })
        );
    
        console.log(
        "[INFO][GET] " + QuestionController.path + ": ",
        );
        res.send(JSON.stringify(r));
    }

    static async post_new(p: Question, res: Response) {
        let sql;
        let data;
        const db = new Database("maggle.db");
    
        const exist_questionnaire = await QuestionnaireController.exist_questionnaire_id(p.questionnaire_id);
        if (!exist_questionnaire) {
          res.status(400).send("[POST][NEW] Questionnaire doesn't exist!");
          return;
        }

        /* Define query */
        sql = "INSERT INTO question VALUES(?,?)";
        data = [
          p.questionnaire_id,
          p.name
        ];
        
        /* Run query */
        db.run(sql, data, function (err) {
          if (err) {
            console.log(
              "[ERROR][POST] sql error " + QuestionController.path + " : " +
                JSON.stringify(p),
            );
            console.error(err.message);
            res.status(500).send();
            return;
          }
    
          console.log(
            "[INFO][POST] data added on " + QuestionController.path + " : " +
              JSON.stringify(p),
          );
      
          res.status(200).send(JSON.stringify({"id":this.lastID}));
        });
        db.close();
    }

      static async post_modify(p: QuestionEntry, res: Response) {
        const db = new Database("maggle.db");
    
        const exist_questionnaire = await QuestionnaireController.exist_questionnaire_id(p.questionnaire_id);
        if (!exist_questionnaire) {
          res.status(400).send("[POST][NEW] Questionnaire doesn't exist!");
          return;
        }
    
        const sql = `UPDATE question SET
        questionnaire_id = ?, name = ?
        WHERE rowid = ?`;
        const data = [
          p.questionnaire_id,
          p.name,
          p.id
        ];
    
        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
          console.log(
            "[ERROR][POST] sql error " + QuestionController.path + " : " +
              JSON.stringify(p),
          );
          console.error(e.message);
          res.status(500).send();
          return;
        }
        db.close();
    
        console.log(
          "[INFO][POST] data updated on " + QuestionController.path + " : " +
            JSON.stringify(p),
        );
        res.status(200).send();
    }

    async post(req: Request, res: Response) {
        let { id, questionnaire_id, name, user_id, password } = req.body;
    
        if (!questionnaire_id || !name || !user_id || !password) {
          console.log(
            "[ERROR][POST] wrong data on " + QuestionController.path + " : " +
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
          const element: Question = new Question(
            questionnaire_id,
            name
          );
          QuestionController.post_new(element, res);
        } else {
          const element: QuestionEntry = new QuestionEntry(
            id,
            questionnaire_id,
            name
          );
          QuestionController.post_modify(element, res);
        }
    }

    async delete(req: Request, res: Response) {
        const db = new Database("maggle.db");
        const { id, user_id, password } = req.body;
    
        if ( !id || !user_id || !password ) {
          console.log(
            "[ERROR][DELETE] wrong data on " + QuestionController.path + " : " +
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
        
    
        const sql = `DELETE FROM question
        WHERE rowid = ?`;
        const data = [id];
    
        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
          console.log(
            "[ERROR][DELETE] sql error " + QuestionController.path + " : " +
              JSON.stringify(id),
          );
          console.error(e.message);
          res.status(500).send();
          return;
        }
        db.close();
    
        console.log(
          "[INFO][DELETE] data deleted on " + QuestionController.path + " : " +
            JSON.stringify(id),
        );
        res.status(200).send();
    }
}

export default QuestionController;

class Question {
    questionnaire_id: number;
    name: string;

    constructor(
        questionnaire_id: number,
        name: string
    ) {
        this.questionnaire_id = questionnaire_id;
        this.name = name;
    }
}

class QuestionEntry {
    id: number;
    questionnaire_id: number;
    name: string;

    constructor(
        id: number,
        questionnaire_id: number,
        name: string
    ) {
        this.id = id;
        this.questionnaire_id = questionnaire_id;
        this.name = name;
    }
}