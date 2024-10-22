import { userbans, userroles, users } from "../models/index.mjs";
import jsonwebtoken from "jsonwebtoken";
import config from "../config/config.mjs";
import { addHours } from 'date-fns';  // Puoi usare una libreria per manipolare le date


export default {

    //Funzione sospensione utente
    async suspendUser(req, res) {
        
        try {
        const token = req.body.token;
        const decoded = jsonwebtoken.verify(token, config.authentication.jwtSecret);
            
        // Verifica se l'utente richiedente è un amministratore
        const requestingUserRole = await userroles.findOne({ where: { UserId: decoded.id } });
        if (!requestingUserRole || requestingUserRole.role !== 1) {
            return res.status(403).send({ error: 'Non autorizzato. Solo gli amministratori possono sospendere gli utenti.' });
        }
    
        const { userId, suspended } = req.body;  // Suspended è un booleano (true/false)
        

        
        // Trova l'utente da sospendere o riattivare
        const user = await users.findOne({
            where: {id: userId}
        });
        if (!user) {
            return res.status(404).send({ error: 'Utente non trovato.' });
        }
        
        const durationHours = req.body.duration; // Durata della sospensione in ore
        const suspendedUntil = addHours(new Date(), durationHours); // Calcola la data di scadenza

        // Crea sospensione
        const newBan = await userbans.create({
            UserId: userId,
            admin_id: decoded.id,
            suspendedUntil: suspendedUntil,
            ban: 2
        });

        res.status(201).send({ ban: newBan.toJSON() });

        // Aggiorna lo stato di sospensione dell'utente
        /*await user.save();*/

        
    
        const message = suspended ? 'Utente sospeso con successo.' : 'Utente riattivato con successo.';
        res.status(200).send({ success: true, message });
        } catch (error) {
        console.error('Errore nella sospensione/riattivazione dell\'utente:', error);
        res.status(500).send({ error: 'Errore del server durante la sospensione/riattivazione dell\'utente.' });
        }
    },

    async isUserSuspended(req, res) {
        try {
            const { userId } = req.params;
            const ban = await userbans.findOne({ where: { UserId: userId } });
    
            if (ban) {
                if (ban.ban === 2 && new Date() > ban.suspendedUntil) {
                    // Se la sospensione è scaduta, riattiva l'utente
                    await ban.destroy();
                    return res.status(200).send({ ban: 0 });
                }
                return res.status(200).send({ ban: ban.ban, suspendedUntil: ban.suspendedUntil });
            }
    
            return res.status(200).send({ ban: 0 });
        } catch (e) {
            console.error('Errore nel controllo del ban:', e);
            res.status(500).send({ error: 'Errore del server.' });
        }
    },
    

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
