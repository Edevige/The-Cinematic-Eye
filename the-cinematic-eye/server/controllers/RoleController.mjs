import { userroles } from '../models/index.mjs';
import jsonwebtoken from 'jsonwebtoken';
import config from '../config/config.mjs';

export default {
  async getUserRole(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(403).send({ error: 'Token mancante' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jsonwebtoken.verify(token, config.authentication.jwtSecret);

      // Trova il ruolo associato all'utente
      const userRole = await userroles.findOne({ where: { UserId: decoded.id } });

      if (!userRole) {
        // Se l'utente non è presente nella tabella UserRole, restituisci il ruolo "normale" (ad esempio, role: 0)
        return res.status(200).send({ role: 0 });
      }

      // Restituisci il ruolo dell'utente se trovato
      res.status(200).send({ role: userRole.role });
    } catch (error) {
      console.error('Errore nel recupero del ruolo dell\'utente:', error);
      res.status(500).send({ error: 'Errore nel server.' });
    }
  },
};
