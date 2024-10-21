import {users, listfilms, userbans} from "../models/index.mjs"
import { OAuth2Client } from "google-auth-library";
import jsonwebtoken from "jsonwebtoken"
import config from "../config/config.mjs";


function jwtTokenGen(user){
    const ONE_WEEK = 60 * 60 * 24 * 7;
    return jsonwebtoken.sign(user, config.authentication.jwtSecret, {
        expiresIn: ONE_WEEK
    })
}

const client= new OAuth2Client(config.googleClientId);

async function verifyGoogleToken(id_token){
    try{
    const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: config.googleClientId,
    });
    if(ticket){
        const payload= ticket.getPayload();
        return payload;
    }
}
    catch(error) {
        console.error("Errore verifica Token: ", error);
    }
}

export default {
    async register(req, res){
        try {
            const user = await users.create(req.body);

            // Crea le 3 liste predefinite per l'utente appena creato
            const listNames = ["Watchlist"];
            for (let listName of listNames) {
                await listfilms.create({
                    title: listName,
                    film: [], // Lista vuota di film
                    UserId: user.id // Associa la lista all'utente
                });
            }
            res.send({
                user: user.toJSON(),
                token: jwtTokenGen(user.toJSON())
            }
                ) 
        } catch (e) { 
            if(e.errors[0].type == "unique violation"){
                res.status(400).send({error: e.errors[0].message})
            }
            else res.status(400).send({error: 'Unexpected error conctat the system admin'})
            
        }         
    },
    async login(req, res) {
        try {
            const match = await users.findOne({
                where: {
                    email: req.body.email
                }
            });
    
            if (!match) {
                res.status(403).send({ error: "Credenziali errate!" });
            } else {
                // Verifica se l'utente è bannato
                const banStatus = await userbans.findOne({ where: { UserId: match.id } });
                if (banStatus && banStatus.ban === 1) {
                    return res.status(403).send({ error: "Il tuo account è stato bannato." });
                }
    
                const isEqual = await match.comparePass(req.body.password);
                if (isEqual) {
                    res.status(200).send({
                        user: match,
                        token: jwtTokenGen(match.toJSON()),
                        message: "Benvenuto " + req.body.email
                    });
                } else {
                    res.status(403).send({ error: "Credenziali errate!" });
                }
            }
        } catch (err) {
            res.status(500).send({
                error: 'An unexpected error occurred, contatta l’amministratore del sistema'
            });
        }
    },
    
    async loginWithGoogleToken(req, res) {
        const id_token = req.body.token_id;
        try {
            const payload = await verifyGoogleToken(id_token);
            const google_id = payload['sub'];
    
            let user = await users.findOne({ where: { google_id } });
            
            if (!user) {
                user = await users.create({
                    email: payload.email,
                    password: 'REGISTERED_VIA_GOOGLE',
                    username: payload.email.split('@')[0],
                    name: payload.name,
                    birthdate: null,
                    subscribed: false,
                    google_id: google_id
                });
    
                const token = jwtTokenGen(user.toJSON());
                return res.status(200).send({ user: user.toJSON(), token });
            }
    
            // Aggiungi il controllo del ban
            const banStatus = await userbans.findOne({ where: { UserId: user.id } });
            if (banStatus && banStatus.ban === 1) {
                return res.status(403).send({ error: "Il tuo account è stato bannato." });
            }
    
            // Invia risposta per utente esistente
            return res.status(200).send({ 
                user: user,
                token: jwtTokenGen(user.toJSON())
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                error: 'Errore nella verifica del token ID di Google o nella creazione utente'
            });
        }
    },
    
    async emailCheck(req, res){
        
        
        try {
            const response=await users.findOne({
                where:{
                    email:req.body.email
                }
            });
            if (response){
                res.send(true);
            }
        } catch (error) {
            console.error(error);
        }
    },
    async deleteAccount(req, res){
        try {
            // Assumendo che req.user.id contenga l'ID dell'utente autenticato
            
            console.log("Ciaooooooooooooooooooooooo", req.headers)
            const decode = jsonwebtoken.verify(req.headers.authorization.split(' ')[1], config.authentication.jwtSecret)
            console.log("DECODIFICATO", decode)
            // Trova l'utente nel database
            const user = await users.findOne({
                where: {
                    username: decode.username
                }
            })
            if (!user) {
                return res.status(404).send({ message: 'Utente non trovato', ok:false });
            }
    
            // Elimina l'utente dal database
            await user.destroy();

    
            return res.status(200).send({ message: 'Account eliminato con successo', ok:true });
        } catch (error) {
            console.error('Errore durante l’eliminazione dell’account:', error);
            return res.status(500).send({ message: 'Errore del server. Riprova più tardi.', ok:false });
        }
    },
      
}