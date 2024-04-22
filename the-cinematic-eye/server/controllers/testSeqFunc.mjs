import {users} from "../models/index.mjs"



export default {
   
    async test(req, res){
        try {
            const amount = await users.count({
              });
              console.log('user n°:' + amount);
              res.send({
                userCount: amount
            });
          } catch (err) {
            res.status(500).send({
                error: 'An unexpected error occured, conctat the system admin'
            })
          }
    }
}