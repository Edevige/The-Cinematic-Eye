import { threads, messages, users } from '../models/index.mjs';
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

};
  