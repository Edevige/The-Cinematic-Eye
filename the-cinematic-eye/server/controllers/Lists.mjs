import { users } from "../models/index.mjs";

export default {
  async watchList(req, res) {
    try {
        var id = req.query.user
        if(!(isNaN(id))){
            const user = await users.findOne({
                where:{
                  id: id  
                }
                
            });
            if(user == null){res.status(406)}
            else{
                res.status(200).send({whatchlist: user.favorites})
            }
        }
        else{res.status(406)}
    } catch (e) {
      console.log(e);
      res.status(400).send({ error: e });
    }
  },
};
