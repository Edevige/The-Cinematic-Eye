import { users } from "../models/index.mjs";
import jsonwebtoken from "jsonwebtoken";
import config from "../config/config.mjs";
import sequelize from "sequelize";

export default {
    async toggleFollowUser(req, res) {
        try {
            const { username, action } = req.body;
            
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).send({ error: 'Token mancante o malformato.' });
            }

            const decoded = jsonwebtoken.verify(token, config.authentication.jwtSecret);
            const currentUserId = decoded.id;

            const targetUser = await users.findOne({ where: { username } });

            if (!targetUser) {
                return res.status(404).send({ error: 'Utente non trovato' });
            }

            // Recupera l'utente corrente dal database
            const currentUser = await users.findOne({ where: { id: currentUserId } });

            // Se il campo `seguiti` è null, inizializzalo come array vuoto
            if (!currentUser.seguiti) {
                currentUser.seguiti = [];
            }

            // Se l'azione è follow, controlla se l'utente è già nei seguiti
            if (action === 'follow') {
                if (currentUser.seguiti.includes(targetUser.id)) {
                    return res.status(400).send({ error: 'Utente già seguito.' });
                }

                await users.update(
                    { seguiti: sequelize.fn('array_append', sequelize.col('seguiti'), targetUser.id) },
                    { where: { id: currentUserId } }
                );
            } else if (action === 'unfollow') {
                if (!currentUser.seguiti.includes(targetUser.id)) {
                    return res.status(400).send({ error: 'Utente non seguito.' });
                }

                await users.update(
                    { seguiti: sequelize.fn('array_remove', sequelize.col('seguiti'), targetUser.id) },
                    { where: { id: currentUserId } }
                );
            }

            res.send({ message: 'Azione completata' });
        } catch (error) {
            console.error('Errore nel seguire/non seguire l\'utente:', error);
            res.status(500).send({ error: 'Errore del server' });
        }
    },
};
