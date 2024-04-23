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
        
    },
    async addFavorite(req, res){
        try{
            var decode = jsonwebtoken.verify(req.body.token, config.authentication.jwtSecret);
        
            const user = await users.findOne({
            where:
            {
              id : decode.id
            } 
            });
            var usrFav = user.favorites;
            if(!usrFav)usrFav = [];
            /*if (usrFav.length >= 3) {
                res.send({msg: "Max number(3) of favorites already reached"});
                
            } else {*/
                if(usrFav.includes(req.body.film_id)){
                    res.status(200).send({msg: "Favorite already added" });
                }
                else{
                    var fav = usrFav.slice();
                    fav.push(req.body.film_id);
                    

                    

                    await user.update({favorites: fav});


                    res.status(200).send({msg: "Favorite successfully added", favArr: user.favorites });
                }
            //}
        }
        catch(e){
            console.log("Error trying to add a favorite movie\n" + e );
            res.status(500).send({
                error: 'An unexpected error occured, conctat the system admin'
            })
        }
        
    },

    async removeFavorite(req, res){
        try {
            var decode = jsonwebtoken.verify(req.body.token, config.authentication.jwtSecret);
            const user = await users.findOne({
                where:
                {
                  id : decode.id
                } 
            });
            var usrFav = user.favorites;
            if(!usrFav){res.status(406).send({msg: "Can't do"});}  
            else{
                var i = usrFav.indexOf(req.body.film_id);
                if(i == -1) {res.status(406).send({msg: "Can't do"});}
                else{
                    
                    
                    var fav = usrFav.slice();

                    fav.splice(i,1);          

                    await user.update({favorites: fav});

                    res.status(200).send({msg: "Favorite successfully removed", favArr: user.favorites });

                }
            }

        } catch (e) {
            console.log("Error trying to remove a favorite movie\n" + e );
            res.status(500).send({
                error: 'An unexpected error occured, conctat the system admin'
            }) 
        }
    }
}
