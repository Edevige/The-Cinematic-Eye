import {users} from "../models/index.mjs"
import jsonwebtoken from "jsonwebtoken"
import config from "../config/config.mjs";

export default {

    async updatePersonalData(req,res){
        switch (req.body.index) {
            case 0:
                console.log('Token: ', req.body.token);
                try {
                    const match = await users.findOne({
                        where: {
                          token: req.body.token
                        }
                      });
                    if(!match){
                        res.status(403).send({ error: "NOP!" });
                    }
                    else{
                        console.log('Match: ', match);
                        console.log('MatchName: ', match.name);
                        console.log('ReqNewName: ',req.body.newName);
                    }
                } catch (error) {
                    console.error(error);
                }
                break;
            case 1:

                break;
            default:
                break;
        }

        
    }
}
