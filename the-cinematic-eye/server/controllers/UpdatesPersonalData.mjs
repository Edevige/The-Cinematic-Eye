import {users} from "../models/index.mjs"
import jsonwebtoken from "jsonwebtoken"
import config from "../config/config.mjs";

export default {

    async updatePersonalData(req, res) {    
        try {
            const match = await users.findOne({
                where: {
                    id: req.body.id
                }
            });
    
            if (!match) {
                return res.status(403).send({ error: "NOP!" });
            } else {
                let controllo;
                switch (req.body.index) {
                    case 0:
                        console.log('Caso cambio Name');      
                        match.name = req.body.nuovoUpdate;
                        await match.save();
                        return res.send({ message: "Nome aggiornato con successo!", status:true});
                    
                    case 1:
                        console.log('Caso cambio Username');
                        controllo = await users.findOne({
                            where: {
                                username: req.body.nuovoUpdate
                            }
                        });
    
                        if (controllo) {
                            console.error('Username già in uso!');
                            return res.status(400).send({ error: 'Username già in uso!' });
                        } else {
                            match.username = req.body.nuovoUpdate;
                            await match.save();
                            return res.send({ message: "Username aggiornato con successo!", status:true });
                        }
    
                    case 2:
                        console.log('Caso cambio Email');
                        controllo = await users.findOne({
                            where: {
                                email: req.body.nuovoUpdate
                            }
                        });
    
                        if (controllo) {
                            console.error('Email già in uso su un altro account!');
                            return res.status(400).send({ error: 'Email già in uso!' });
                        } else {
                            match.email = req.body.nuovoUpdate;
                            await match.save();
                            return res.send({ message: "Email aggiornata con successo!" , status:true });
                        }
    
                    case 3:
                        console.log('Caso cambio Password');
                        match.password = req.body.nuovoUpdate;
                        await match.save();
                        return res.status(200).send({ message: "Password aggiornata con successo!" , status:true });
    
                    case 4:
                        console.log('Caso cambio Birthday');
                        match.birthdate = req.body.nuovoUpdate;
                        await match.save();
                        return res.send({ message: "Data di nascita aggiornata con successo!" , status:true });
                    case 5:
                        console.log('Caso cambio private');
                        match.private=req.body.nuovoUpdate;
                        await match.save();
                        return res.send({ message: "Privacy aggiornata con successo!" , status:true });
                    default:
                        return res.status(400).send({ error: "Richiesta non valida!" });
                }
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send({ error: 'Si è verificato un errore interno del server.' });
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
    },

    async addFollow(req, res){
        try{
            var decode = jsonwebtoken.verify(req.body.token, config.authentication.jwtSecret);
        
            const user = await users.findOne({
            where:
            {
              id : decode.id
            } 
            });
            var usrSeguiti = user.seguiti;
            console.log("Followed User ID:", req.body.follow_id);

            if(!usrSeguiti)usrSeguiti = [];
                if(usrSeguiti.includes(req.body.follow_id)){
                    res.status(200).send({msg: "Follow already added" });
                }
                else{
                    var fl = usrSeguiti.slice();
                    fl.push(req.body.follow_id);
                    

                    

                    await user.update({seguiti: fl});


                    res.status(200).send({msg: "Follow successfully added", followArr: user.seguiti });
                }
                console.log("User's seguiti after update:", user.seguiti);
            //}
        }
        catch(e){
            console.log("Error trying to add a follow\n" + e );
            res.status(500).send({
                error: 'An unexpected error occured, conctat the system admin'
            })
        }
        
    },

    async removeFollow(req, res){
        try {
            var decode = jsonwebtoken.verify(req.body.token, config.authentication.jwtSecret);
            const user = await users.findOne({
                where:
                {
                  id : decode.id
                } 
            });
            var usrSeguiti = user.seguiti;
            if(!usrSeguiti){res.status(406).send({msg: "Can't do"});}  
            else{
                var i = usrSeguiti.indexOf(req.body.follow_id);
                if(i == -1) {res.status(406).send({msg: "Can't do"});}
                else{
                    
                    
                    var fl = usrSeguiti.slice();

                    fl.splice(i,1);          

                    await user.update({seguiti: fl});

                    res.status(200).send({msg: "Follow successfully removed", followArr: user.seguiti });

                }
            }

        } catch (e) {
            console.log("Error trying to remove a follow\n" + e );
            res.status(500).send({
                error: 'An unexpected error occured, conctat the system admin'
            }) 
        }
    },
}
