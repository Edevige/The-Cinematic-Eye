import { threads, messages, users, userroles } from '../models/index.mjs';
import jsonwebtoken from 'jsonwebtoken';
import config from '../config/config.mjs';

export default {
    // Recupera o crea un thread per un film
    async getOrCreateThread(req, res) {
        try {
            const filmId = req.params.filmId;  // Recupera filmId dai parametri della route
            const { filmTitle } = req.body;    // filmTitle viene ancora passato nel body della richiesta
    
            // Controlla se esiste già un thread per questo film
            let thread = await threads.findOne({ where: { film_id: filmId } });
            console.log('Chiamata getOrCreateThread con filmId:', req.params.filmId);
            if (!thread) {
                // Se non esiste, crea un nuovo thread con il titolo e l'id del film
                thread = await threads.create({
                    title: filmTitle,
                    film_id: filmId,
                    UserId: null  // UserId è nullo per thread creati automaticamente
                });
            }
    
            // Restituisci il thread esistente o appena creato
            res.status(200).send(thread);
        } catch (error) {
            console.error('Errore nel recupero o creazione del thread:', error);
            res.status(500).send({ error: 'Errore interno del server.' });
        }
    },

    // Aggiungi un nuovo messaggio nel thread
    async addMessage(req, res) {
        try {
            const decoded = jsonwebtoken.verify(req.body.token, config.authentication.jwtSecret);
            const { text } = req.body;
            const threadId = req.params.threadId; // Recupera l'ID del thread dall'URL
    
            const newMessage = await messages.create({
                text: text,
                ThreadId: threadId, // Assicurati di usare correttamente threadId
                UserId: decoded.id,
            });
    
            res.status(201).send({ success: true, message: newMessage });
        } catch (error) {
            console.error('Errore nell\'invio del messaggio:', error);
            res.status(500).send({ error: 'Errore del server.' });
        }
    },
    // Funzione per ottenere tutti i messaggi di un thread
    async  getMessagesByThread(req, res) {
        try {
        const threadId = req.params.threadId;
    
        // Trova tutti i messaggi per un determinato thread
        const threadMessages = await messages.findAll({
            where: { ThreadId: threadId },
            include: [{ model: users, attributes: ['username'] }] // Includi i dati dell'utente che ha scritto il messaggio
        });
    
        // Restituisci i messaggi trovati
        res.status(200).send(threadMessages);
        } catch (error) {
        console.error('Errore nel recupero dei messaggi:', error);
        res.status(500).send({ error: 'Errore nel recupero dei messaggi.' });
        }
    },

    async deleteMessage(req, res) {
        try {
          const decode = jsonwebtoken.verify(req.headers.authorization.split(' ')[1], config.authentication.jwtSecret);
          const userId = decode.id;
          const message = await messages.findOne({ where: { id: req.params.id, } });
          
          // Trova se l'utente loggato è un amministratore nella tabella userroles
          const admin = await userroles.findOne({ where: { UserId: userId, role: 1 } });
    
          // Controlla se l'utente è un amministratore
          if (!admin) {
              return res.status(403).send({ error: 'Non sei autorizzato a modificare questa recensione.' });
          }

          if (!message) {
            return res.status(404).send({ error: 'Commento non trovato o non autorizzato.' });
          }
      
          await message.destroy();
      
          res.send({ message: 'Commento eliminato con successo.' });
        } catch (e) {
          console.log(e);
          res.status(400).send({ error: 'Errore durante l\'eliminazione del commento.' });
        }
    },
    // ForumController.mjs
    async getUserForums(req, res) {
        try {
            const forums = await threads.findAll({
                where: {
                    film_id: null // Filtra i forum con film_id uguale a null
                },
                attributes: ['id', 'title', 'film_id'] // Restituisci solo l'id e il titolo
            });
            res.send(forums);
        } catch (error) {
            console.error('Errore nel recupero dei forum:', error);
            res.status(500).send({ error: 'Errore nel recupero dei forum.' });
        }
    },    
    // Funzione per ottenere un forum specifico e i relativi messaggi
    async getForumById(req, res) {
        console.log('Chiamata getForumById con ID:', req.params.id);
        try {
            const threadId = req.params.id;
            const forum = await threads.findOne({
                where: { id: threadId },
            });
            if (!forum) {
                return res.status(404).send({ error: 'Forum non trovato' });
            }
            res.status(200).send({
                forum: {
                    id: forum.id,
                    title: forum.title,
                },
            });
        } catch (error) {
            console.error('Errore nel recupero del forum:', error);
            res.status(500).send({ error: 'Errore del server.' });
        }
    },
    // Funzione per creare un nuovo forum
    async createForum(req, res) {
        try {
          const { title, film_id } = req.body;
      
          if (!title || title.trim() === '') {
            return res.status(400).send({ error: 'Il titolo è richiesto.' });
          }
      
          // Assicurati che film_id sia trattato come null per forum generici
          const newThread = await threads.create({
            title: title,
            film_id: film_id || null,  // Se film_id è undefined o altro, usa null
          });
      
          res.status(201).send(newThread);
        } catch (error) {
          console.error('Errore nella creazione del forum:', error);
          res.status(500).send({ error: 'Errore del server durante la creazione del forum.' });
        }
    }
      

};
  