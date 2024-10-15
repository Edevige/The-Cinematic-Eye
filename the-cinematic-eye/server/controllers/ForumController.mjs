import { threads, messages } from '../models/index.mjs';
import jsonwebtoken from 'jsonwebtoken';
import config from '../config/config.mjs';

export default {
    // Recupera o crea un thread per un film
    async getOrCreateThread(req, res) {
        try {
            const { filmId, filmTitle } = req.body; // Ottieni filmId e filmTitle dal corpo della richiesta
    
            // Controlla se esiste già un thread per questo film
            let thread = await threads.findOne({ where: { film_id: filmId } });
    
            if (!thread) {
                // Se non esiste, crea un nuovo thread con il titolo e l'id del film
                thread = await threads.create({
                    title: filmTitle,  // Usa il titolo passato dal frontend
                    film_id: filmId,
                    UserId: null // UserId è nullo per thread creati automaticamente
                });
            }
    
            // Se esiste o è stato creato, restituisci il thread
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
        const { text, threadId } = req.body;

        const newMessage = await messages.create({
            text: text,
            ThreadId: threadId,
            UserId: decoded.id,
        });

        res.status(201).send({ success: true, message: newMessage });
        } catch (error) {
        console.error('Errore nell\'invio del messaggio:', error);
        res.status(500).send({ error: 'Errore del server.' });
        }
    },
};
  