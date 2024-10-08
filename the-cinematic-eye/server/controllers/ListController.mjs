import { listfilms } from '../models/index.mjs'; 
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
  
  
}

