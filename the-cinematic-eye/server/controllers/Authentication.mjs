import {users} from "../models/index.mjs"
export default {
    async register(req, res){
        try {
            console.log(req.body);
            const user = await users.create(req.body);
            res.send(user.toJSON())
        } catch (error) {
            res.status(400).send({
                e: error,
                b: req.body
            })
        }
    }
}