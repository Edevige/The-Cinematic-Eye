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
        try {
            const user = await users.create(req.body);
            res.send({
                user: user.toJSON(),
                token: jwtTokenGen(user.toJSON())
            }
                ) 
        } catch (e) { 
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
    }
}