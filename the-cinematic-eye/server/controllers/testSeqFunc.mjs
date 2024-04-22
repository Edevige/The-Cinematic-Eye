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
    },
    async testJson(req, res){
      try {
        const user = await users.findOne({
          where:
          {
            id : 1
          }
          });
          user.favorites = {
            favorites_id:[194, 837335, 313369]
          }
          await user.save();
          console.log('user fav updated');
          res.send(
            user.favorites
        );
      } catch (err) {
        res.status(500).send({
            error: 'An unexpected error occured, conctat the system admin'
        })
      }
    
    
    }
}