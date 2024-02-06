import {users} from "../models/index.mjs"
import jsonwebtoken from "jsonwebtoken"
import config from "../config/config.mjs";
import {OAuth2Client} from 'google-auth-library';

function jwtTokenGen(user){
    const ONE_WEEK = 60 * 60 * 24 * 7;
    return jsonwebtoken.sign(user, config.authentication.jwtSecret, {
        expiresIn: ONE_WEEK
    })
}

const client= new OAuth2Client('599203859511-5f3c2e9dkgg7qjplu44f4qa1i57t1kf9.apps.googleusercontent.com');

async function verifyGoogleToken(id_token){
    const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: '599203859511-5f3c2e9dkgg7qjplu44f4qa1i57t1kf9.apps.googleusercontent.com',
    });
}

export default {
    async register(req, res){
        try {
            const user = await users.create(req.body);
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
    async login(req, res){
        try {
            const match = await users.findOne({
                where: {
                  email: req.body.email
                }
              });
            if(!match){
                res.status(403).send({ error: "NOP!" });
            }
            else {
                const isEqual = await match.comparePass(req.body.password);
                if(isEqual) {
                    res.status(200).send({ 
                    user: match,
                    token: jwtTokenGen(match.toJSON()),
                    message: "General "+req.body.email });
                } else {
                    res.status(403).send({ error: "NOP!" });
            }}
          } catch (err) {
            res.status(500).send({
                error: 'An unexpected error occured, conctat the system admin'
            })
          }
    },
    async loginWithGoogleToken(req, res){
        const {id_token} = req.body;
        try {
            const payload = await verifyGoogleToken(id_token);
            const {email, name, picture} = payload;

            let user= await users.findOne({where:{email}});
            if(!user){
                user=await users.create({email,name,picture});
            }

            const token=jwtTokenGen(user.toJSON());
            res.send({
                user:user.toJSON(),
                token,
            })
        } catch (error) {
            console.error(error);
            res.status(500).send({
                error: 'Errore nella verifica del token ID di Google o nella creazione utente'
            });
        }
    }
}