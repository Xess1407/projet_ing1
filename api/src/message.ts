import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import UserController from "./user";

class MessageController implements Controller {
    static path = "/message";
    router: Router;

    constructor() {
        this.router = Router();
        this.router.post(MessageController.path, this.post);
        this.router.post(MessageController.path + "/contact", this.get_all_contact);
        this.router.post(MessageController.path + "/chat", this.get_messages);
        this.router.delete(MessageController.path, this.delete);
    }

    static get_values() {
        const db = new Database("maggle.db");
        const sql = "SELECT rowid, * FROM message";
    
        return new Promise((resolve, reject) =>
          db.all(sql, [], (err, rows) => {
            if (err) {
              console.log(err);
            }
            resolve(rows);
          })
        );
    }

    async get_all_contact(req: Request, res: Response) {
        let { user_id, password} = req.body;

        if (!user_id ||!password) {
            console.log(
                "[ERROR][POST] wrong data on " + MessageController.path + " : " +
                    JSON.stringify(req.body),
                );
            res.status(400).send();
            return;
        }

        /* Check identifiers */
        let identified = await UserController.identifyUser(user_id, password);
        if (!identified) {
          res.status(401).send("Wrong password!");
          return;
        }

        /* Get all contact ID */
        let contact_id = new Array<number>();
        await MessageController.get_values().then((rows: any) =>
            rows.forEach((row) => {
                if (row.emitter == user_id) contact_id.push(row.receiver)
                if (row.receiver == user_id) contact_id.push(row.emitter)
            })
        )

        /* Get all contact names */
        let r = new Array<string>();
        await UserController.get_values().then((rows:any) => {
            rows.forEach((row) => {
                contact_id.forEach((contact) => {
                    if (row.rowid == contact) r.push(row.name)
                })
            })
        })

        res.send(JSON.stringify(r));
    }

    async get_messages(req: Request, res: Response) {
        let { user_id, password, contact_id} = req.body;

        if (!user_id ||!password || !contact_id) {
            console.log(
                "[ERROR][POST] wrong data on " + MessageController.path + " : " +
                    JSON.stringify(req.body),
                );
            res.status(400).send();
            return;
        }

        /* Check identifiers */
        let identified = await UserController.identifyUser(user_id, password);
        if (!identified) {
          res.status(401).send("Wrong password!");
          return;
        }
        
        
        /* Get all messages */
        let r = new Array<MessageEntry>();
        await MessageController.get_values().then((rows: any) =>
            rows.forEach((row) => {
                if ((row.emitter == user_id && row.receiver == contact_id) || (row.emitter == contact_id && row.receiver == user_id)) {
                    r.push( new MessageEntry(
                        row.rowid,
                        row.emitter,
                        row.receiver,
                        row.content,
                        row.date
                    ));
                }
            })
        )
        
        console.log(
          "[INFO][POST] " + MessageController.path + ": " + user_id,
        );
        res.send(JSON.stringify(r));

    }

    static async post_new(p: Message, res: Response) {
        let sql;
        let data;
        const db = new Database("maggle.db");
        
        sql = "INSERT INTO message VALUES(?, ?, ?, ?)";
        data = [
          p.emitter,
          p.receiver,
          p.content,
          p.date
        ];
    
        /* Run query */
        let e;
        db.run(sql, data, function (err) {
          if (err) {
            console.log(
              "[ERROR][POST] sql error " + MessageController.path + " : " +
                JSON.stringify(p),
            );
            console.error(e.message);
            res.status(500).send();
            return;
          }
    
          console.log(
            "[INFO][POST] data added on " + MessageController.path + " : " +
              JSON.stringify(p),
          );
      
          res.status(200).send(JSON.stringify({"id:":this.lastID}));
        });
        db.close();
    }

    static async post_modify(p: MessageEntry, res: Response) {
        const db = new Database("maggle.db");

        const sql = `UPDATE message SET
        emitter = ?, receiver = ?, content = ?, date = ?
        WHERE rowid = ?`;
        const data = [
            p.emitter,
            p.receiver,
            p.content,
            p.date,
            p.id
        ];

        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
            console.log(
            "[ERROR][POST] sql error " + MessageController.path + " : " +
                JSON.stringify(p),
            );
            console.error(e.message);
            res.status(500).send();
            return;
        }
        db.close();

        console.log(
            "[INFO][POST] data updated on " + MessageController.path + " : " +
            JSON.stringify(p),
        );
        res.status(200).send();
    }

    async post(req: Request, res: Response) {
        let { id, emitter, receiver, content, date} = req.body;

        if (
            !emitter || !receiver || !content || !date
        ) {
            console.log(
            "[ERROR][POST] wrong data on " + MessageController.path + " : " +
                JSON.stringify(req.body),
            );
            res.status(400).send();
            return;
        }

        /* Check identifiers emitter ? */
        

        if (!id) {
            const element: Message = new Message(
                emitter,
                receiver,
                content,
                date
            );
            MessageController.post_new(element, res);
        } else {
            const element: MessageEntry = new MessageEntry(
                id,
                emitter,
                receiver,
                content,
                date
            );
            MessageController.post_modify(element, res);
        }
    }

    async delete(req: Request, res: Response) {
        const db = new Database("maggle.db");
        const { id, user_id, password } = req.body;
    
        if ( !id || !password ) {
          console.log(
            "[ERROR][DELETE] wrong data on " + MessageController.path + " : " +
              JSON.stringify(req.body),
          );
          res.status(400).send();
          return;
        }

        /* Check identifiers */
        let identified = await UserController.identifyUser(user_id, password);
        if (!identified) {
          res.status(401).send("Wrong password!");
          return;
        }
    
        const sql = `DELETE FROM message
        WHERE rowid = ? AND emitter = ?`;
        const data = [id, user_id];
    
        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
          console.log(
            "[ERROR][DELETE] sql error " + MessageController.path + " : " +
              JSON.stringify(id),
          );
          console.error(e.message);
          res.status(500).send();
          return;
        }
        db.close();
    
        console.log(
          "[INFO][DELETE] data deleted on " + MessageController.path + " : " +
            JSON.stringify(id),
        );
        res.status(200).send();
    }
}

export default MessageController

class Message {
    emitter: number;
    receiver: number;
    content: string;
    date: string;

    constructor(
        emitter: number,
        receiver: number,
        content: string,
        date: string
    ) {
        this.emitter = emitter;
        this.receiver = receiver;
        this.content = content;
        this.date = date;
    }
}

class MessageEntry {
    id: number;
    emitter: number;
    receiver: number;
    content: string;
    date: string;

    constructor(
        id: number,
        emitter: number,
        receiver: number,
        content: string,
        date: string
    ) {
        this.id = id;
        this.emitter = emitter;
        this.receiver = receiver;
        this.content = content;
        this.date = date;
    }
}