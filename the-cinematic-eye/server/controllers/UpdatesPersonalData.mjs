import {users} from "../models/index.mjs"
import jsonwebtoken from "jsonwebtoken"
import config from "../config/config.mjs";

export default {

    async updatePersonalData(req,res){
        switch (req.body.index) {
            case 1:
                try {
                    const match = await users.findOne({
                        where: {
                          name: req.body.oldName
                        }
                      });
                    if(!match){
                        res.status(403).send({ error: "NOP!" });
                    }
                    else{
                        console.log(match.name);
                        console.log(req.body.newName);
                    }
                } catch (error) {
                    console.error(error);
                }
                break;
        
            default:
                break;
        }
        console.log("risposta: ", req.body.newName);
        
    }
}
