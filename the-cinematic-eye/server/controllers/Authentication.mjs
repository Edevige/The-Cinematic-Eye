import argon2d from "argon2";
import {users} from "../models/index.mjs"
export default {
    async register(req, res){

            console.log(req.body);
            const bodyHashed = {
                email: req.body.email,
                password: await argon2d.hash(req.body.password)
            }
            const user = await users.create(bodyHashed);
            res.send(user.toJSON())
        
    }

}