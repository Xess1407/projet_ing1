import multer from "multer";
import * as fs from "fs";
import Controller from "./controller";
import { Request, Response, Router } from "express";

const sharp = require('sharp')

//Setting storage engine
const storageEngine = multer.diskStorage({
 destination: "./files/",
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({
    limits: { fileSize: 1000000 },
    storage: storageEngine,
})

const uploadFiles = async (req, res) => {
  try {
      await sharp(`./files/${req.file.originalname}`).resize({ width: 250, height: 250 }).png().toFile(`./files/m${req.file.originalname}`)
      fs.rm(`./files/${req.file.originalname}`, (err) => {
        if(err) console.error(err.message);
      })
      res.status(201).send('Image uploaded succesfully')
  } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
}

class FileController implements Controller {
  static path = "/file";
  router: Router;

  constructor() {
    this.router = new Router();
    this.router.get(FileController.path + "/:name", this.download);
    this.router.post(
      FileController.path,
      upload.single("file"),
      uploadFiles,
    );
  }

  download(req: Request, res: Response) {
    const fileName = req.params.name;
    const directoryPath = "files/";

    res.download(directoryPath + fileName, fileName, (err) => {

      console.log("[INFO][GET] file : " + fileName);
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
  }
}

export default FileController;
