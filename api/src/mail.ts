import Controller from "./controller";
import { Request, Response, Router } from "express";
import { log } from "console";
import nodemailer from "nodemailer";

class MailController implements Controller {
  static path = "/mail";
  router: Router;

  constructor() {
    this.router = Router();
    this.router.post(MailController.path, this.send_mail);
  }

  async send_mail(req: Request, res: Response) {
    let { from, to, subject, text } = req.body;
    if (
      !from || !to || !subject || !text
    ) {
      console.log(
        "[ERROR][POST] wrong data on " + MailController.path + " : " +
          JSON.stringify(req.body),
      );
      res.status(400).send();
      return;
    }
    
    // Configurer le transporteur de messagerie
    const transporter = nodemailer.createTransport({
        // Configuration du service de messagerie (par exemple, Gmail)
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
        user: 'maggle31052023@gmail.com',
        pass: 'rsgkbkqnebcoltml',
        },
    });

    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: text,
    };

    // Envoyer l'e-mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('[ERROR][POST] Erreur lors de l\'envoi de l\'e-mail:', error);
        } else {
            console.log('[INFO][POST] E-mail envoyé avec succès:', info.response);
        }
    });
    res.status(200).send();
  }
}

export default MailController;