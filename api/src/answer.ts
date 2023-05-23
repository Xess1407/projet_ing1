import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import UserController from "./user";
import QuestionnaireController from "./questionnaire";
import QuestionController from "./question";
import TeamController from "./team";

class AnswerController implements Controller {
    static path = "/answer";
    router: Router;

    constructor() {
        this.router = Router();
        this.router.post(AnswerController.path, this.post);
        this.router.get(AnswerController.path, this.get_all);
        this.router.get(AnswerController.path + "/:id", this.get);
        this.router.delete(AnswerController.path, this.delete);
    }
    
    static get_values() {
        const db = new Database("maggle.db");
        const sql = "SELECT rowid, * FROM answer";
    
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
    
        let r = new Array<AnswerEntry>;
    
        if (!id) {
          console.log (
            "[ERROR][GET] wrong data on " + AnswerController.path + "/" + id + ": " +
              JSON.stringify(req.body),
          );
          res.status(400).send();
          return;
        }
    
        let found = false;
        await AnswerController.get_values().then((rows: any) =>
            rows.forEach((row) => {
                if (row.question_id == id) {
                    found = true;
                    r.push(new QuestionEntry(
                        row.rowid,
                        row.question_id,
                        row.team_id,
                        row.content
                    ));
                }
            })
        );
    
        if (found) {
          console.log(
            "[INFO][GET] " + AnswerController.path + "/" + id + ": ",
          );
          res.send(JSON.stringify(r));
        } else {
          res.status(400).send();
        }
    }

    async get_all(req: Request, res: Response) {
        let r = new Array<AnswerEntry>;
    
        await AnswerController.get_values().then((rows: any) =>
            rows.forEach((row) => {
                r.push(new AnswerEntry(
                    row.rowid,
                    row.question_id,
                    row.team_id,
                    row.content
                ));
            })
        );
    
        console.log(
        "[INFO][GET] " + AnswerController.path + ": ",
        );
        res.send(JSON.stringify(r));
    }

    static async post_new(p: Answer, res: Response) {
        let sql;
        let data;
        const db = new Database("maggle.db");
    
        const exist_question = await QuestionController.exist_question_id(p.question_id);
        if (!exist_question) {
          res.status(400).send("[POST][NEW] Question doesn't exist!");
          return;
        }

        const exist_team = await TeamController.exist_team_id(p.team_id);
        if (!exist_team) {
          res.status(400).send("[POST][NEW] Team doesn't exist!");
          return;
        }

        /* Define query */
        sql = "INSERT INTO answer (question_id, team_id, content) VALUES(?,?,?)";
        data = [
          p.question_id,
          p.team_id,
          p.content
        ];
        
        /* Run query */
        db.run(sql, data, function (err) {
          if (err) {
            console.log(
              "[ERROR][POST] sql error " + AnswerController.path + " : " +
                JSON.stringify(p),
            );
            console.error(err.message);
            res.status(500).send();
            return;
          }
    
          console.log(
            "[INFO][POST] data added on " + AnswerController.path + " : " +
              JSON.stringify(p),
          );
      
          res.status(200).send(JSON.stringify({"id:":this.lastID}));
        });
        db.close();
    }

    static async post_modify(p: AnswerEntry, res: Response) {
        const db = new Database("maggle.db");
    
        const exist_question = await QuestionController.exist_question_id(p.question_id);
        if (!exist_question) {
          res.status(400).send("[POST][NEW] Question doesn't exist!");
          return;
        }

        const exist_team = await TeamController.exist_team_id(p.team_id);
        if (!exist_team) {
          res.status(400).send("[POST][NEW] Team doesn't exist!");
          return;
        }
    
        const sql = `UPDATE answer SET
        question_id = ?, team_id = ?, content = ?, score = ?
        WHERE rowid = ?`;
        const data = [
          p.question_id,
          p.team_id,
          p.content,
          p.score,
          p.id
        ];
    
        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
          console.log(
            "[ERROR][POST] sql error " + AnswerController.path + " : " +
              JSON.stringify(p),
          );
          console.error(e.message);
          res.status(500).send();
          return;
        }
        db.close();
    
        console.log(
          "[INFO][POST] data updated on " + AnswerController.path + " : " +
            JSON.stringify(p),
        );
        res.status(200).send();
    }

    async post(req: Request, res: Response) {
        let { id, question_id, team_id, content, score, user_id, password } = req.body;
    
        if (!question_id || !team_id || !content || !user_id || !password) {
          console.log(
            "[ERROR][POST] wrong data on " + AnswerController.path + " : " +
              JSON.stringify(req.body),
          );
          res.status(400).send();
          return;
        }
    
        /* Check identifiers */
        let isUser = await UserController.identifyUser(user_id, password);
        if (!isUser) {
          res.status(401).send("Wrong password!");
          return;
        }

        let isStudent = await UserController.identifyStudent(user_id, password);
        let isManager = await UserController.identifyManager(user_id, password);

        if(isStudent) {
            // Vérifier que l'étudiant est bien le capitaine de son équipe
            let captain_id = await TeamController.get_user_captain_id_by_team_id(team_id);
            if(user_id != captain_id) {
                res.status(401).send("This student is not captain of their team!");
                return;
            }
        
            if (!id) {
            const element: Answer = new Answer(
                question_id,
                team_id,
                content
            );
            AnswerController.post_new(element, res);
            } else {
            const element: AnswerEntry = new AnswerEntry(
                id,
                question_id,
                team_id,
                content,
                score
            );
            AnswerController.post_modify(element, res);
            }
        } else if(isManager) {
            if(!score) {
                console.log(
                "[ERROR][POST] wrong data on " + AnswerController.path + " : " +
                    JSON.stringify(req.body),
                );
                res.status(400).send();
                return;
            }
            const element: AnswerEntry = new AnswerEntry(
                id,
                question_id,
                team_id,
                content,
                score
            );
            AnswerController.post_modify(element, res);
        }
    }

    async delete(req: Request, res: Response) {
        const db = new Database("maggle.db");
        const { id, team_id, user_id, password } = req.body;
    
        if ( !id || !user_id || !password ) {
          console.log(
            "[ERROR][DELETE] wrong data on " + AnswerController.path + " : " +
              JSON.stringify(req.body),
          );
          res.status(400).send();
          return;
        }

        /* Check identifiers */
        let identified = await UserController.identifyStudent(user_id, password);
        if (!identified) {
          res.status(401).send("Wrong password!");
          return;
        }

        // Vérifier que l'étudiant est bien le capitaine de son équipe
        let captain_id = await TeamController.get_user_captain_id_by_team_id(team_id);
        if(user_id != captain_id) {
            res.status(401).send("This student is not captain of their team!");
            return;
        }
    
        const sql = `DELETE FROM answer
        WHERE rowid = ?`;
        const data = [id];
    
        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
          console.log(
            "[ERROR][DELETE] sql error " + AnswerController.path + " : " +
              JSON.stringify(id),
          );
          console.error(e.message);
          res.status(500).send();
          return;
        }
        db.close();
    
        console.log(
          "[INFO][DELETE] data deleted on " + AnswerController.path + " : " +
            JSON.stringify(id),
        );
        res.status(200).send();
    }
}

export default AnswerController;

class Answer {
    question_id: number;
    team_id: number;
    content: string;
    score;

    constructor(
        question_id: number,
        team_id: number,
        content: string
    ) {
        this.question_id = question_id;
        this.team_id = team_id;
        this.content = content;
        this.score = undefined;
    }
}

class AnswerEntry {
    id: number;
    question_id: number;
    team_id: number;
    content: string;
    score: number;

    constructor(
        id: number,
        question_id: number,
        team_id: number,
        content: string,
        score: number
    ) {
        this.id = id;
        this.question_id = question_id;
        this.team_id = team_id;
        this.content = content;
        this.score = score;
    }
}