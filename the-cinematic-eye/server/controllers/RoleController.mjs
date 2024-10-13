import { userroles as UserRole } from '../models/index.mjs';
import jsonwebtoken from 'jsonwebtoken';
import config from '../config/config.mjs';

export default {
  //Funzione sospensione utente
  async suspendUser(req, res) {
    try {
      const token = req.body.token;
      const decoded = jsonwebtoken.verify(token, config.authentication.jwtSecret);
  
      // Verifica se l'utente richiedente è un amministratore
      const requestingUserRole = await UserRole.findOne({ where: { UserId: decoded.id } });
      if (!requestingUserRole || requestingUserRole.role !== 1) {
        return res.status(403).send({ error: 'Non autorizzato. Solo gli amministratori possono sospendere gli utenti.' });
      }
  
      const { userId, suspended } = req.body;  // Suspended è un booleano (true/false)
  
      // Trova l'utente da sospendere o riattivare
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({ error: 'Utente non trovato.' });
      }
  
      // Aggiorna lo stato di sospensione dell'utente
      user.suspended = suspended;
      await user.save();
  
      const message = suspended ? 'Utente sospeso con successo.' : 'Utente riattivato con successo.';
      res.status(200).send({ success: true, message });
    } catch (error) {
      console.error('Errore nella sospensione/riattivazione dell\'utente:', error);
      res.status(500).send({ error: 'Errore del server durante la sospensione/riattivazione dell\'utente.' });
    }
  },
  // Funzione per ottenere il ruolo dell'utente loggato
  async getUserRole(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(403).send({ error: 'Token mancante' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jsonwebtoken.verify(token, config.authentication.jwtSecret);

      // Trova il ruolo associato all'utente loggato
      const userRole = await UserRole.findOne({ where: { UserId: decoded.id } });

      if (!userRole) {
        // Se l'utente non è presente nella tabella UserRole, restituisci il ruolo "normale" (ad esempio, role: 0)
        return res.status(200).send({ role: 0 });
      }

      // Restituisci il ruolo dell'utente se trovato
      res.status(200).send({ role: userRole.role });
    } catch (error) {
      console.error('Errore nel recupero del ruolo dell\'utente:', error);
      res.status(500).send({ error: 'Errore del server.' });
    }
  },

  // Funzione per ottenere il ruolo di un utente specifico tramite il suo ID
  async getUserRoleById(req, res) {
    try {
      const userId = req.params.id;

      // Trova il ruolo associato all'utente specifico
      const userRole = await UserRole.findOne({ where: { UserId: userId } });

      if (!userRole) {
        // Se l'utente non è presente nella tabella UserRole, è un utente base
        return res.status(200).send({ role: 0 });
      }

      // Restituisci il ruolo dell'utente specificato
      res.status(200).send({ role: userRole.role });
    } catch (error) {
      console.error('Errore nel recupero del ruolo dell\'utente specificato:', error);
      res.status(500).send({ error: 'Errore del server.' });
    }
  },

  // Funzione per aggiornare il ruolo di un utente
  async updateUserRole(req, res) {
    try {
      const token = req.body.token;
      const decoded = jsonwebtoken.verify(token, config.authentication.jwtSecret);

      // Trova il ruolo dell'utente che sta facendo la richiesta
      const requestingUserRole = await UserRole.findOne({ where: { UserId: decoded.id } });

      // Verifica se l'utente richiedente è un amministratore
      if (!requestingUserRole || requestingUserRole.role !== 1) {
        return res.status(403).send({ error: 'Non autorizzato. Solo gli amministratori possono aggiornare i ruoli.' });
      }

      const { userId, role } = req.body;

      // Log per vedere il ruolo ricevuto
      console.log(`Ruolo ricevuto: ${role}, per l'utente con ID: ${userId}`);

      // Controlla se l'utente ha già un record nella tabella UserRole
      const existingUserRole = await UserRole.findOne({ where: { UserId: userId } });

      if (role < 1) {
        // Se l'utente viene declassato a utente base, elimina completamente il record dalla tabella UserRole
        if (existingUserRole) {
          console.log(`Eliminazione del ruolo per l'utente con ID: ${userId}`);
          await UserRole.destroy({ where: { UserId: userId } });
          return res.status(200).send({ success: true, message: 'L\'utente è stato declassato a utente base e il ruolo è stato rimosso.' });
        } else {
          console.log(`Nessun ruolo trovato per l'utente con ID: ${userId}`);
          return res.status(404).send({ error: 'Nessun ruolo trovato per l\'utente da declassare.' });
        }
      }

      if (role > 0) {
        // Se il ruolo è diverso da base (0), procedi con l'aggiornamento o creazione del ruolo
        if (existingUserRole) {
          console.log(`Aggiornamento del ruolo per l'utente con ID: ${userId}`);
          await UserRole.update({ role }, { where: { UserId: userId } });
          return res.status(200).send({ success: true, message: 'Ruolo aggiornato con successo.' });
        } else {
          console.log(`Creazione di un nuovo ruolo per l'utente con ID: ${userId}`);
          await UserRole.create({ UserId: userId, role });
          return res.status(200).send({ success: true, message: 'Ruolo assegnato con successo.' });
        }
      }

    } catch (error) {
      console.error('Errore nell\'aggiornamento del ruolo:', error);
      res.status(500).send({ error: 'Errore del server durante l\'aggiornamento del ruolo.' });
    }
  },
};

