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
        } catch (error) { 
            res.status(400).send({er: error})
        }         
    },
    async login(req, res){
        try {
            const match = await users.findAll({
                where: {
                  email: req.body.email
                }
              });
            if (await argon2id.verify(match[0].password, req.body.password)) {
                res.send({ message: "General "+req.body.email });
            } else {
                res.send({ message: "NOP!" });
            }
          } catch (err) {
            res.send({
                er: err
            })
          }
    }
}