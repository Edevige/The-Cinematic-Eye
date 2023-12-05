import argon2id from "argon2";
import {users} from "../models/index.mjs"
export default {
    async register(req, res){
            const bodyHashed = {
                email: req.body.email,
                password: await argon2id.hash(req.body.password)
            }
        try {
            const user = await users.create(bodyHashed);
            res.send(user.toJSON()) 
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
                res.status(403).send({ message: "NOP!" });
            }
            else if(await argon2id.verify(match.password, req.body.password)) {
                res.status(200).send({ message: "General "+req.body.email });
            } else {
                res.status(403).send({ message: "NOP!" });
            }
          } catch (err) {
            res.send({
                error: err
            })
          }
    }
}