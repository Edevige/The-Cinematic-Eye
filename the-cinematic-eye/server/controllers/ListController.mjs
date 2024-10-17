import { listfilms,userroles, users } from '../models/index.mjs'; 
import jsonwebtoken from "jsonwebtoken";
import config from "../config/config.mjs";

export default {
  async getUserLists(req, res) {
    try {
      console.log("Authorization Header:", req.headers.authorization); // Log dell'header
      const decode = jsonwebtoken.verify(req.headers.authorization.split(' ')[1], config.authentication.jwtSecret);
      const found = await listfilms.findAll({ where: { UserId: decode.id } });
      res.send({ listfilms: found });
    } catch (e) {
      console.log("Errore nel controller getUserLists:", e); // Log dell'errore
      res.status(400).send({ error: 'Errore inatteso, contatta l’amministratore di sistema' });
    }
  },

  async getAllList(req,res){
    try {
      const found= await listfilms.findAll();
      res.send({listfilms: found})
    } catch (error) {
      console.error("Errore nel controller getUserLists:", e); // Log dell'errore
      res.status(400).send({ error: 'Errore inatteso, contatta l’amministratore di sistema' });
    }
  },

  // Funzione per creare una nuova lista di film
  async createList(req, res) {
    try {
      const decode = jsonwebtoken.verify(req.headers.authorization.split(' ')[1], config.authentication.jwtSecret);
      const userId = decode.id;
      const { title, visible } = req.body;

      // Recupera il ruolo dell'utente
      const userRole = await userroles.findOne({ where: { UserId: userId } });
      const role = userRole ? userRole.role : 0; // Se l'utente non ha un ruolo, lo consideriamo utente base (role = 0)

      // Verifica se l'utente ha già una lista con lo stesso titolo
      const existingList = await listfilms.findOne({ where: { UserId: userId, title: title } });
      
      // Se esiste una lista con lo stesso titolo, invia un messaggio di errore
      if (existingList) {
        return res.status(400).send({ error: 'Esiste già una lista con questo titolo.' });
      }

      // Recupera il numero di liste esistenti per l'utente
      const existingLists = await listfilms.count({ where: { UserId: userId } });

      // Se l'utente è base e ha già 3 liste, non permettere la creazione
      if (role === 0 && existingLists >= 3) {
        return res.status(400).send({ error: 'Hai raggiunto il limite massimo di 3 liste.' });
      }

      // Crea la nuova lista
      const newList = await listfilms.create({
        title: title,
        visible: visible,
        UserId: userId,
        film: [],  // Lista vuota inizialmente
        follower: 0 // Inizialmente nessun follower
      });

      res.status(201).send({ success: true, newList: newList });
    } catch (error) {
      console.error('Errore nella creazione della lista:', error);
      res.status(500).send({ error: 'Errore inatteso, contatta l’amministratore di sistema.' });
    }
  },

  async deleteList(req, res) {
      try {
          const decode = jsonwebtoken.verify(req.headers.authorization.split(' ')[1], config.authentication.jwtSecret);
          const listId = req.params.id;

          const list = await listfilms.findOne({ where: { id: listId, UserId: decode.id } });
          
          if (!list) {
              return res.status(404).send({ error: 'Lista non trovata.' });
          }

          // Elimina la lista
          await list.destroy();
          
          res.status(200).send({ success: true, message: 'Lista eliminata con successo.' });
      } catch (error) {
          console.error('Errore durante l\'eliminazione della lista:', error);
          res.status(500).send({ error: 'Errore inatteso, riprova più tardi.' });
      }
  },

  async addFilmToList(req, res) {
    try {
      const decode = jsonwebtoken.verify(req.body.token, config.authentication.jwtSecret);
      const listId = req.body.listId; // ID della lista
      const filmId = req.body.filmId; // ID del film da aggiungere
      
      // Trova la lista dell'utente specificata
      const list = await listfilms.findOne({ where: { id: listId, UserId: decode.id } });
      
      if (!list) {
        return res.status(404).send({ error: 'Lista non trovata o non autorizzato.' });
      }
  
      // Inizializza l'array 'film' se non esiste
      if (!list.film) list.film = [];
  
      // Crea una copia dell'array e aggiungi l'ID del film se non è già presente
      const filmList = list.film.slice();
      if (!filmList.includes(filmId)) {
          filmList.push(filmId);
          
          await list.update({ film: filmList });
      
          res.status(200).send({ success: true, message: 'Film aggiunto alla lista con successo', filmList });
      } else {
          res.status(400).send({ error: 'Il film è già presente nella lista.' });
      }
    
  
    } catch (error) {
      console.log('Errore nell\'aggiunta del film alla lista:', error);
      res.status(500).send({ error: 'Errore inatteso, riprova più tardi.' });
    }
  },
  async getList(req, res) {
    try {
      const listId = req.params.id;
      const list = await listfilms.findOne({ where: { id: listId } });
      
      if (!list) {
        return res.status(404).send({ error: 'Lista non trovata.' });
      }
  
      res.send(list);
    } catch (error) {
      console.error('Errore nel recupero della lista:', error);
      res.status(500).send({ error: 'Errore del server.' });
    }
  },
  async removeFilmFromList(req, res) {
    try {
        const { listId, filmId } = req.body;
        const list = await listfilms.findOne({ where: { id: listId } });
        
        if (!list) {
            return res.status(404).send({ error: 'Lista non trovata.' });
        }
        
        // Rimuovi il film dalla lista
        const updatedFilmList = list.film.filter(id => id !== filmId);
        await list.update({ film: updatedFilmList });
        
        res.status(200).send({ success: true, filmList: updatedFilmList });
    } catch (error) {
        console.error('Errore nella rimozione del film:', error);
        res.status(500).send({ error: 'Errore del server.' });
    }
  },
  async updateList(req, res) {
    try {
        const { title, visible } = req.body;
        const listId = req.params.listId;

        const list = await listfilms.findOne({ where: { id: listId } });
        
        if (!list) {
            return res.status(404).send({ error: 'Lista non trovata.' });
        }

        // Aggiorna il titolo e la visibilità
        await list.update({ title: title, visible: visible });
        
        res.status(200).send({ success: true, list });
    } catch (error) {
        console.error('Errore nell\'aggiornamento della lista:', error);
        res.status(500).send({ error: 'Errore del server.' });
    }
  },

  async followList(req, res) {
    try {    
      const decode = jsonwebtoken.verify(req.headers.authorization.split(' ')[1], config.authentication.jwtSecret);
        const userId = decode.id;
        console.log(req.body.listId);
        
        const listId = req.body.listId;

        // Trova l'utente
        const user = await users.findOne({ where: { id: userId } });
        
        if (!user) {
            return res.status(404).send({ error: 'Utente non trovato.' });
        }

        // Inizializza l'array followingList se è vuoto
        if (!user.followingList) user.followingList = [];

        // Verifica se l'utente sta già seguendo la lista
        if (user.followingList.includes(listId)) {
            return res.status(400).send({ error: 'Stai già seguendo questa lista.' });
        }

        // Aggiungi l'ID della lista all'array followingList
        const updatedFollowingList = [...user.followingList, listId];
        await user.update({ followingList: updatedFollowingList });

        // Aggiorna il numero di follower della lista
        const list = await listfilms.findOne({ where: { id: listId } });
        if (list) {
            list.follower += 1;
            await list.save();
        }

        res.status(200).send({ success: true, message: 'Ora stai seguendo questa lista.', updatedFollowingList });
    } catch (error) {
        console.error('Errore nel seguire la lista:', error);
        res.status(500).send({ error: 'Errore inatteso, riprova più tardi.' });
    }
},

async unfollowList(req, res) {
  try {
    console.log('REEEEQ', req.headers);
    console.log('REEEEQ', req.body);
    
      const decode = jsonwebtoken.verify(req.headers.authorization.split(' ')[1], config.authentication.jwtSecret);
      
      const userId = decode.id;
      const listId = req.body.listId;
      console.log(listId);

      // Trova l'utente
      const user = await users.findOne({ where: { id: userId } });

      if (!user) {
          return res.status(404).send({ error: 'Utente non trovato.' });
      }

      // Verifica se l'utente segue effettivamente la lista
      if (!user.followingList || !user.followingList.includes(listId)) {
          return res.status(400).send({ error: 'Non segui questa lista.' });
      }

      // Rimuovi l'ID della lista dall'array followingList
      const updatedFollowingList = user.followingList.filter(id => id !== listId);
      await user.update({ followingList: updatedFollowingList });

      // Aggiorna il numero di follower della lista
      const list = await listfilms.findOne({ where: { id: listId } });
      if (list) {
          list.follower -= 1;
          await list.save();
      }

      res.status(200).send({ success: true, message: 'Hai smesso di seguire la lista.', updatedFollowingList });
  } catch (error) {
      console.error('Errore nel smettere di seguire la lista:', error);
      res.status(500).send({ error: 'Errore inatteso, riprova più tardi.' });
  }
}
}

