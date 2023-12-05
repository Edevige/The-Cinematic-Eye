//import argon2id from "argon2";
import {users} from "../models/index.mjs"
import jsonwebtoken from "jsonwebtoken"
import config from "../config/config.mjs";

function jwtTokenGen(user){
    const ONE_WEEK = 60 * 60 * 24 * 7;
    return jsonwebtoken.sign(user, config.authentication.jwtSecret, {
        expiresIn: ONE_WEEK
    })
}


export default {
    async register(req, res){
            const bodyHashed = {
                email: req.body.email,
                //password: await argon2id.hash(req.body.password)
                password: req.body.password
            }
        try {
            const user = await users.create(bodyHashed);
            res.send(user.toJSON()) 
        } catch (e) { 
            console.log(e);
            res.status(400).send({error: e})
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
                res.status(403).send({ message: "NOP!" });
            }
            //else if(await argon2id.verify(match.password, req.body.password)) {
            else if(match.comparePass(req.body.password)) {
                res.status(200).send({ 
                    user: match,
                    token: jwtTokenGen(match.toJSON()),
                    message: "General "+req.body.email });
            } else {
                res.status(403).send({ message: "NOP!" });
            }
          } catch (err) {
            res.status(500).send({
                error: 'An unexpected error occured, conctat the system admin'
            })
          }
    }
}