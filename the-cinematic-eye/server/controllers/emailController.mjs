import { users, listfilms } from "../models/index.mjs";
import { send } from "vite";


export default{
    
    async subscribeNewsletter(req,res){
        try {
            const found= await users.findOne({
                where:{
                    email:req.body.email
                }
            });
            if(!found){
                res.status(500).send({success:false, message:'utente non trovato'});
            }
            else{
                found.subscribed=true;
                found.save();
                res.status(200).send({success:true, message:'Utente iscritto alla newsletter... hai ricevuto il messaggio di benvenuto?'});
            }
        } catch (error) {
            res.status(500).send({success:false, message:'Errore per iscriversi alla newsletter'});
        }
    },

    async cancelNewsletter(req,res){
        try {
            const found= await users.findOne({
                where:{
                    email:req.body.email
                }
            });
            if(!found){
                res.status(500).send({success:false, message:'utente non trovato'});
            }
            else{
                found.subscribed=false;
                found.save();
                res.status(200).send({success:true, message:'Utente non più iscritto alla newsletter... Ci dispiace vederti andare via!'});
            }
        } catch (error) {
            res.status(500).send({success:false, message:'Errore per cancellare iscrizione alla newsletter'});
        }
    }
}