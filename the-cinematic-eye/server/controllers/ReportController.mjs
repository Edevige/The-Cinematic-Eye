import { reports } from '../models/index.mjs';
import jsonwebtoken from 'jsonwebtoken';
import config from '../config/config.mjs';

export default {
    async createReport(req, res) {
        try {
          const { reason, text, userId } = req.body;
    
          // Verifica che i parametri siano validi
          if (!text || !userId) {
            return res.status(400).send({ error: 'Text e UserId sono richiesti.' });
          }
    
          // Crea il report con reason = "creazione forum"
          const newReport = await reports.create({
            reason: reason,
            text: text,        // Il testo inserito dall'utente
            UserId: userId     // ID dell'utente che ha creato il report
          });
    
          res.status(201).send(newReport);
        } catch (error) {
          console.error('Errore nella creazione del report:', error);
          res.status(500).send({ error: 'Errore interno del server.' });
        }
    },
    async getAllReports(req, res) {
      try {
        const allReports = await reports.findAll();
        res.status(200).send(allReports);
      } catch (error) {
        console.error('Errore nel recuperare i report:', error);
        res.status(500).send({ error: 'Errore interno del server.' });
      }
    },
    // Funzione per eliminare un report
    async deleteReport(req, res) {
        try {
          console.log(req.params.id)
            const reportId = req.params.id;

            // Trova il report da eliminare
            const report = await reports.findByPk(reportId);
            if (!report) {
                return res.status(404).send({ error: 'Report non trovato.' });
            }

            // Elimina il report
            await report.destroy();
            res.status(200).send({ message: 'Report eliminato con successo.' });
        } catch (error) {
            console.error('Errore nell\'eliminazione del report:', error);
            res.status(500).send({ error: 'Errore interno del server.' });
        }
    },
};
