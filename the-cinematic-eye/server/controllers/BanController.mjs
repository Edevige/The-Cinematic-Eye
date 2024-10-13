import { userbans } from "../models/index.mjs";
import jsonwebtoken from "jsonwebtoken";
import config from "../config/config.mjs";

export default {

    async isUserBanned(req, res) {
        try {
            const { userId } = req.params;
            const ban = await userbans.findOne({ where: { UserId: userId } });

            if (ban) {
                return res.status(200).send({ ban: ban.ban, text: ban.text });
            }

            return res.status(200).send({ ban: 0 });
        } catch (e) {
            console.error('Errore nel controllo del ban:', e);
            res.status(500).send({ error: 'Errore nel controllo del ban.' });
        }
    },

    async addUserBan(req, res) {
        try {
            const decoded = jsonwebtoken.verify(req.body.token, config.authentication.jwtSecret);
            const adminId = decoded.id;
            const { user_id, text } = req.body;  
    
            // Verifica se l'utente è già bannato usando 'user_id' correttamente
            const existingBan = await userbans.findOne({ where: { UserId: user_id } });
    
            if (existingBan) {
                return res.status(400).send({ error: 'Utente già bannato.' });
            }
    
            // Crea il nuovo ban
            const newBan = await userbans.create({
                UserId: user_id,
                admin_id: adminId,
                text: text || 'Nessun motivo specificato',
                ban: 1
            });
    
            res.status(201).send({ ban: newBan.toJSON() });
        } catch (e) {
            console.error('Errore nell\'aggiunta del ban:', e);
            res.status(500).send({ error: 'Errore nell\'aggiunta del ban.' });
        }
    },

    async removeUserBan(req, res) {
        try {
            if (!req.headers.authorization) {
                return res.status(400).send({ error: 'Token di autorizzazione mancante.' });
            }
            const decoded = jsonwebtoken.verify(req.headers.authorization.split(' ')[1], config.authentication.jwtSecret);
            const adminId = decoded.id;
    
            const { userId } = req.params;  // Ottieni 'userId' dall'URL
    
            const ban = await userbans.findOne({ where: { UserId: userId } });
    
            if (!ban) {
                return res.status(404).send({ error: 'Utente non bannato.' });
            }
    
            await ban.destroy();  // Rimuovi il ban
    
            res.status(200).send({ message: 'Ban rimosso con successo.' });
        } catch (e) {
            console.error('Errore nella rimozione del ban:', e);
            res.status(500).send({ error: 'Errore nella rimozione del ban.' });
        }
    }
    ,
    
};
