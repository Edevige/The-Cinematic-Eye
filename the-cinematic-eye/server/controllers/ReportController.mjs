import { reports } from '../models/index.mjs';
import jsonwebtoken from 'jsonwebtoken';
import config from '../config/config.mjs';

export default {
    async createReport(req, res) {
        try {
          const { text, userId } = req.body;
    
          // Verifica che i parametri siano validi
          if (!text || !userId) {
            return res.status(400).send({ error: 'Text e UserId sono richiesti.' });
          }
    
          // Crea il report con reason = "creazione forum"
          const newReport = await reports.create({
            reason: 'creazione forum',
            text: text,        // Il testo inserito dall'utente
            UserId: userId     // ID dell'utente che ha creato il report
          });
    
          res.status(201).send(newReport);
        } catch (error) {
          console.error('Errore nella creazione del report:', error);
          res.status(500).send({ error: 'Errore interno del server.' });
        }
    }
};
