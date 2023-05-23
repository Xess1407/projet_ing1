import Controller from "./controller";
import { Request, Response, Router } from "express";
import { Database } from "sqlite3";

class MemberController implements Controller {
    static path = "/resource-challenge";
    router: Router;

    constructor() {
        this.router = new Router();
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


}

export default MemberController

class Member {
    data_challenge_id: number;
    name: string;
    url: string;

    constructor(
        data_challenge_id: number,
        name: string,
        url: string
    ) {
        this.data_challenge_id = data_challenge_id;
        this.name = name;
        this.url = url;
    }
}

class MemberEntry {
    id: number;
    data_challenge_id: number;
    name: string;
    url: string;

    constructor(
        id: number,
        data_challenge_id: number,
        name: string,
        url: string
    ) {
        this.id = id;
        this.data_challenge_id = data_challenge_id;
        this.name = name;
        this.url = url;
    }
}