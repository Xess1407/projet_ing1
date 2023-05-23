import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";
import UserController from "./user";
import DataProjectController from "./data_project";

class ResourceProjectController implements Controller {
    static path = "/resource-project";
    router: Router;

    constructor() {
        this.router = Router();
        this.router.post(ResourceProjectController.path, this.post);
        this.router.get(ResourceProjectController.path, this.get_all);
        this.router.get(ResourceProjectController.path + "/:id", this.get);
        this.router.delete(ResourceProjectController.path, this.delete);
    }

    static get_values() {
        const db = new Database("maggle.db");
        const sql = "SELECT rowid, * FROM resource_project";
    
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
    
        let r;
    
        if (!id) {
          console.log (
            "[ERROR][GET] wrong data on " + ResourceProjectController.path + "/" + id + ": " +
              JSON.stringify(req.body),
          );
          res.status(400).send();
          return;
        }
    
        let found = false;
        await ResourceProjectController.get_values().then((rows: any) =>
        rows.forEach((row) => {
            if (row.rowid == id) {
            found = true;
            r = new ResourceProjectEntry(
                row.rowid,
                row.data_project_id,
                row.name,
                row.url
            );
            }
        })
        );
    
        if (found) {
          console.log(
            "[INFO][GET] " + ResourceProjectController.path + "/" + id + ": ",
          );
          res.send(JSON.stringify(r));
        } else {
          res.status(400).send();
        }
    }

    async get_all(req: Request, res: Response) {
        let r = new Array<ResourceProjectEntry>;
    
        await ResourceProjectController.get_values().then((rows: any) =>
            rows.forEach((row) => {
                r.push(new ResourceProjectEntry(
                    row.rowid,
                    row.data_project_id,
                    row.name,
                    row.url
                ));
            })
        );
    
        console.log(
        "[INFO][GET] " + ResourceProjectController.path + ": ",
        );
        res.send(JSON.stringify(r));
    }

    static async post_new(p: ResourceProject, res: Response) {
        let sql;
        let data;
        const db = new Database("maggle.db");
    
        const exist = await DataProjectController.exist_data_project(p.data_project_id);
        if (!exist) {
          res.status(400).send();
          return;
        }
        
        sql = "INSERT INTO resource_project VALUES(?,?,?)";
        data = [
          p.data_project_id,
          p.name,
          p.url
        ];
    
        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
          console.log(
            "[ERROR][POST] sql error " + ResourceProjectController.path + " : " +
              JSON.stringify(p),
          );
          console.error(e.message);
          res.status(500).send();
          return;
        }
        db.close();
    
        console.log(
          "[INFO][POST] data added on " + ResourceProjectController.path + " : " +
            JSON.stringify(p),
        );
        res.status(200).send();
    }
    
    static async post_modify(p: ResourceProjectEntry, res: Response) {
        const db = new Database("maggle.db");

        const exist = await DataProjectController.exist_data_project(p.data_project_id);
        if (!exist) {
            res.status(400).send();
            return;
        }

        const sql = `UPDATE resource_project SET
        data_project_id = ?, name = ?, url = ?
        WHERE rowid = ?`;
        const data = [
            p.data_project_id,
            p.name,
            p.url,
            p.id
        ];

        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
            console.log(
            "[ERROR][POST] sql error " + ResourceProjectController.path + " : " +
                JSON.stringify(p),
            );
            console.error(e.message);
            res.status(500).send();
            return;
        }
        db.close();

        console.log(
            "[INFO][POST] data updated on " + ResourceProjectController.path + " : " +
            JSON.stringify(p),
        );
        res.status(200).send();
    }

    async post(req: Request, res: Response) {
        let { id, data_project_id, name, url, password } = req.body;

        if (
            !data_project_id || !name || !url || !password
        ) {
            console.log(
            "[ERROR][POST] wrong data on " + ResourceProjectController.path + " : " +
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
            const element: ResourceProject = new ResourceProject(
            data_project_id,
            name,
            url
            );
            ResourceProjectController.post_new(element, res);
        } else {
            const element: ResourceProjectEntry = new ResourceProjectEntry(
            id,
            data_project_id,
            name,
            url
            );
            ResourceProjectController.post_modify(element, res);
        }
    }

    async delete(req: Request, res: Response) {
        const db = new Database("maggle.db");
        const { id, password } = req.body;
    
        if ( !id || !password ) {
          console.log(
            "[ERROR][DELETE] wrong data on " + ResourceProjectController.path + " : " +
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
    
        const sql = `DELETE FROM resource_project
        WHERE rowid = ?`;
        const data = [id];
    
        let e;
        db.run(sql, data, (err) => e = err);
        if (e) {
          console.log(
            "[ERROR][DELETE] sql error " + ResourceProjectController.path + " : " +
              JSON.stringify(id),
          );
          console.error(e.message);
          res.status(500).send();
          return;
        }
        db.close();
    
        console.log(
          "[INFO][DELETE] data deleted on " + ResourceProjectController.path + " : " +
            JSON.stringify(id),
        );
        res.status(200).send();
    }
}

export default ResourceProjectController;

class ResourceProject {
    data_project_id: number;
    name: string;
    url: string;

    constructor(
        data_project_id: number,
        name: string,
        url: string
    ) {
        this.data_project_id = data_project_id;
        this.name = name;
        this.url = url;
    }
}

class ResourceProjectEntry {
    id: number;
    data_project_id: number;
    name: string;
    url: string;

    constructor(
        id: number,
        data_project_id: number,
        name: string,
        url: string
    ) {
        this.id = id;
        this.data_project_id = data_project_id;
        this.name = name;
        this.url = url;
    }
}