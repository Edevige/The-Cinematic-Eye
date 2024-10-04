import {users} from "../models/index.mjs"
import jsonwebtoken from "jsonwebtoken"
import config from "../config/config.mjs";

export default {

    async updatePersonalData(req,res){    
        try {
            const match= await users.findOne({
                where: {
                    id: req.body.id
                }
            });   
        console.log(match);
        if (!match) {
            res.status(403).send({ error: "NOP!" });
        } else {
            let controllo;
            switch (req.body.index) {
                case 0:
                    console.log('Caso cambio Name');      
                    match.name=req.body.nuovoUpdate;
                    match.save();
                    break;
                case 1:
                    console.log('Caso cambio Username');
                    controllo= await users.findOne({
                        where:{
                            username: req.body.nuovoUpdate
                        }
                    })

                    console.log('Controllo BE LIKE: ', controllo);
                    
                    if(controllo){
                        console.error('Username già in uso!');
                    }
                    else{
                        match.username=req.body.nuovoUpdate;
                        match.save();}
                    break;
                case 2:
                    console.log('Caso cambio Email');
                    controllo= await users.findOne({
                        where: {
                            email: req.body.nuovoUpdate
                        }
                    });
                    console.log('Controllo BE LIKE: ', controllo);
                    if(controllo){
                        console.error('Email già in uso su un altro account!');
                    }
                    else{
                        match.email=req.body.nuovoUpdate;
                        match.save();}
                    break;
                case 3:
                    console.log('Caso cambio Password');
                    console.log('Match BE LIKE: ', match.password);
                    console.log('NewPass BE LIKE: ', req.body.nuovoUpdate);
                    match.password=req.body.nuovoUpdate;
                    match.save();
                    break;
                case 4:
                    console.log('Caso cambio birthday');
                    console.log(match.birthdate);
                    console.log(req.body.birthdate);
                    match.birthdate=req.body.nuovoUpdate;
                    match.save();
                default:
                    break;
            }
        }
        } catch (error) {
            console.error(error);
        }
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
    },

    async addSeen(req, res){
        try{
            var decode = jsonwebtoken.verify(req.body.token, config.authentication.jwtSecret);
        
            const user = await users.findOne({
            where:
            {
              id : decode.id
            } 
            });
            var usrSeen = user.seen;
            if(!usrSeen)usrSeen = [];
                if(usrSeen.includes(req.body.film_id)){
                    res.status(200).send({msg: "Seen already added" });
                }
                else{
                    var sn = usrSeen.slice();
                    sn.push(req.body.film_id);
                    

                    

                    await user.update({seen: sn});


                    res.status(200).send({msg: "Seen successfully added", seenArr: user.seen });
                }
            //}
        }
        catch(e){
            console.log("Error trying to add a seen movie\n" + e );
            res.status(500).send({
                error: 'An unexpected error occured, conctat the system admin'
            })
        }
        
    },

    async removeSeen(req, res){
        try {
            var decode = jsonwebtoken.verify(req.body.token, config.authentication.jwtSecret);
            const user = await users.findOne({
                where:
                {
                  id : decode.id
                } 
            });
            var usrSeen = user.seen;
            if(!usrSeen){res.status(406).send({msg: "Can't do"});}  
            else{
                var i = usrSeen.indexOf(req.body.film_id);
                if(i == -1) {res.status(406).send({msg: "Can't do"});}
                else{
                    
                    
                    var sn = usrSeen.slice();

                    sn.splice(i,1);          

                    await user.update({seen: sn});

                    res.status(200).send({msg: "Seen successfully removed", seenArr: user.seen });

                }
            }

        } catch (e) {
            console.log("Error trying to remove a seen movie\n" + e );
            res.status(500).send({
                error: 'An unexpected error occured, conctat the system admin'
            }) 
        }
    }
}
