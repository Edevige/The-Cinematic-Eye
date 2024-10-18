import nodemailer from 'nodemailer';
import { users } from "../models/index.mjs";

async function createTransporter() {
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // Non utilizzare TLS per test
      auth: {
        user: 'kaylin.schmidt@ethereal.email', // Utente generato
        pass: 'jqh1wU6HrfamhnuPdX', // Password generata
      },
    });

    return transporter;
  }

export default {
  async subscribeNewsletter(req, res) {
    try {
      const found = await users.findOne({
        where: {
          email: req.body.email
        }
      });

      if (!found) {
        res.status(500).send({ success: false, message: 'Utente non trovato' });
      } else {
        found.subscribed = true;
        await found.save();
        res.status(200).send({ success: true, message: 'Utente iscritto alla newsletter... hai ricevuto il messaggio di benvenuto?' });
      }
    } catch (error) {
      res.status(500).send({ success: false, message: 'Errore per iscriversi alla newsletter' });
    }
  },

  async cancelNewsletter(req, res) {
    try {
      const found = await users.findOne({
        where: {
          email: req.body.email
        }
      });

      if (!found) {
        res.status(500).send({ success: false, message: 'Utente non trovato' });
      } else {
        found.subscribed = false;
        await found.save();
        res.status(200).send({ success: true, message: 'Utente non più iscritto alla newsletter... Ci dispiace vederti andare via!' });
      }
    } catch (error) {
      res.status(500).send({ success: false, message: 'Errore per cancellare iscrizione alla newsletter' });
    }
  },

  async sendNewsletterEmail(req,res) {
    try {  
      let transporter = await createTransporter();
      let info = await transporter.sendMail({
        from: '"La tua newsletter" <newsletter@example.com>',
        to: 'kaylin.schmidt@ethereal.email',
        subject: 'Benvenuto alla newsletter!',
        text: 'Grazie per esserti iscritto alla nostra newsletter!',
        html: '<b>Grazie per esserti iscritto alla nostra newsletter!</b>',
      });

      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.error('Errore durante l\'invio dell\'email:', error);
    }
  },

  
}
