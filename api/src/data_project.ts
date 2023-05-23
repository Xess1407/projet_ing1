import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import DataChallengeController from "./data_challenge";
import UserController from "./user";

class DataProjectController implements Controller {
    static path = "/project";
    router: Router;

    constructor() {
        this.router = new Router();
        this.router.post(DataProjectController.path, this.post);
        this.router.get(DataProjectController.path, this.get_all);
        this.router.get(DataProjectController.path + "/:id", this.get);
        this.router.delete(DataProjectController.path, this.delete);
    }

    static get_values() {
        const db = new Database("maggle.db");
        const sql = "SELECT rowid, * FROM data_project";
    
        return new Promise((resolve, reject) =>
          db.all(sql, [], (err, rows) => {
            if (err) {
              console.log(err);
            }
            resolve(rows);
          })
        );
    }

    static async exist_data_project(data_project_id: number): bool {
        let res = false;
        await DataProjectController.get_values().then((rows: any) =>
          rows.forEach((row) => {
            if (row.rowid == data_project_id) {
              res = true;
            }
          })
        );
    
        return res;
      }

    async get(req: Request, res: Response) {
        let id = req.params.id;
    
        let r;
    
        if (!id) {
          console.log (
            "[ERROR][GET] wrong data on " + DataProjectController.path + "/" + id + ": " +
              JSON.stringify(req.body),
          );
          res.status(400).send();
          return;
        }
    
        let found = false;
        await DataProjectController.get_values().then((rows: any) =>
        rows.forEach((row) => {
            if (row.rowid == id) {
            found = true;
            r = new DataProjectEntry(
                row.rowid,
                row.data_challenge_id,
                row.name,
                row.description,
                row.image
            );
            }
        })
        );
    
        if (found) {
          console.log(
            "[INFO][GET] " + DataProjectController.path + "/" + id + ": ",
          );
          res.send(JSON.stringify(r));
        } else {
          res.status(400).send();
        }
    }

    async get_all(req: Request, res: Response) {
        let r = new Array<DataProjectEntry>;
    
        await DataProjectController.get_values().then((rows: any) =>
            rows.forEach((row) => {
                r.push(new DataProjectEntry(
                    row.rowid,
                    row.data_challenge_id,
                    row.name,
                    row.description,
                    row.image
                ));
            })
        );
    
        console.log(
        "[INFO][GET] " + DataProjectController.path + ": ",
        );
        res.send(JSON.stringify(r));
    }

    static async post_new(p: DataProject, res: Response) {
        let sql;
        let data;
        const db = new Database("maggle.db");
    
        const exist = await DataChallengeController.exist_data_challenge(p.data_challenge_id);
        if (!exist) {
          res.status(400).send();
          return;
        }
        
        sql = "INSERT INTO data_project VALUES(?,?,?,?)";
        data = [
          p.data_challenge_id,
          p.name,
          p.description,
          p.image
        ];
    
        /* Run query */
        let e;
        db.run(sql, data, function (err) {
          if (err) {
            console.log(
              "[ERROR][POST] sql error " + DataProjectController.path + " : " +
                JSON.stringify(p),
            );
            console.error(e.message);
            res.status(500).send();
            return;
          }
    
          console.log(
            "[INFO][POST] data added on " + DataProjectController.path + " : " +
              JSON.stringify(p),
          );
      
          res.status(200).send(JSON.stringify({"id:":this.lastID}));
        });
        db.close();
    }
    
    static async post_modify(p: DataProjectEntry, res: Response) {
        const db = new Database("maggle.db");

        const exist = await DataChallengeController.exist_data_challenge(p.data_challenge_id);
        if (!exist) {
            res.status(400).send();
            return;
        }

        const sql = `UPDATE data_project SET
        data_challenge_id = ?, name = ?, description = ?, image = ?
        WHERE rowid = ?`;
        const data = [
            p.data_challenge_id,
            p.name,
            p.description,
            p.image,
            p.id
        ];

        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
            console.log(
            "[ERROR][POST] sql error " + DataProjectController.path + " : " +
                JSON.stringify(p),
            );
            console.error(e.message);
            res.status(500).send();
            return;
        }
        db.close();

        console.log(
            "[INFO][POST] data updated on " + DataProjectController.path + " : " +
            JSON.stringify(p),
        );
        res.status(200).send();
    }

    async post(req: Request, res: Response) {
        let { id, data_challenge_id, name, description, image, password } = req.body;

        if (
            !data_challenge_id || !name || !description || !image || !password
        ) {
            console.log(
            "[ERROR][POST] wrong data on " + DataProjectController.path + " : " +
                JSON.stringify(req.body),
            );
            res.status(400).send();
            return;
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

        if (!id) {
            const element: DataProject = new DataProject(
            data_challenge_id,
            name,
            description,
            image
            );
            DataProjectController.post_new(element, res);
        } else {
            const element: DataProjectEntry = new DataProjectEntry(
            id,
            data_challenge_id,
            name,
            description,
            image
            );
            DataProjectController.post_modify(element, res);
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
    
        const sql = `DELETE FROM data_project
        WHERE rowid = ?`;
        const data = [id];
    
        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
          console.log(
            "[ERROR][DELETE] sql error " + DataProjectController.path + " : " +
              JSON.stringify(id),
          );
          console.error(e.message);
          res.status(500).send();
          return;
        }
        db.close();
    
        console.log(
          "[INFO][DELETE] data deleted on " + DataProjectController.path + " : " +
            JSON.stringify(id),
        );
        res.status(200).send();
    }
}

export default DataProjectController;

class DataProject {
    data_challenge_id: number;
    name: string;
    description: string;
    image: string;

    constructor(
        data_challenge_id: number,
        name: string,
        description: string,
        image: string
    ) {
        this.data_challenge_id = data_challenge_id;
        this.name = name;
        this.description = description;
        this.image = image;
    }
}

class DataProjectEntry {
    id: number;
    data_challenge_id: number;
    name: string;
    description: string;
    image: string;

    constructor(
        id: number,
        data_challenge_id: number,
        name: string,
        description: string,
        image: string
    ) {
        this.id = id;
        this.data_challenge_id = data_challenge_id;
        this.name = name;
        this.description = description;
        this.image = image;
    }
}