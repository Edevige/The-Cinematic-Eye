import { reviews } from "../models/index.mjs";
import jsonwebtoken from "jsonwebtoken";
import config from "../config/config.mjs";

export default{

    async createReview(req, res){
        try {
            var decode = jsonwebtoken.verify(req.body.token, config.authentication.jwtSecret);


            const review = await reviews.create({film_id: req.body.film_id, text: req.body.text, UserId: decode.id, spoiler: req.body.spoiler, rating: req.body.rating});
            res.send({
                review: review.toJSON(),
            }
                ) 
        } catch (e) { 
            console.log(e);
            res.status(400).send({error: 'Unexpected error conctat the system admin'})   
        }
    },
    async getFilmReviews(req, res){
        try {

            const found = await reviews.findAll({where: {film_id: req.body.film_id}})

            res.send({
                reviews: found
            }
                ) 
        } catch (e) { 
            console.log(e);
            res.status(400).send({error: 'Unexpected error conctat the system admin'})   
        }
    },
    async getUserReviews(req, res) {
        try {
          console.log("Authorization Header:", req.headers.authorization); // Log dell'header
          const decode = jsonwebtoken.verify(req.headers.authorization.split(' ')[1], config.authentication.jwtSecret);
          const found = await reviews.findAll({ where: { UserId: decode.id } });
          res.send({ reviews: found });
        } catch (e) {
          console.log("Errore nel controller getUserReviews:", e); // Log dell'errore
          res.status(400).send({ error: 'Errore inatteso, contatta l’amministratore di sistema' });
        }
    },
    async updateReview(req, res) {
        try {
          const decode = jsonwebtoken.verify(req.headers.authorization.split(' ')[1], config.authentication.jwtSecret);
          const review = await reviews.findOne({ where: { id: req.body.id, UserId: decode.id } });
      
          if (!review) {
            return res.status(404).send({ error: 'Recensione non trovata o non autorizzato.' });
          }
      
          review.rating = req.body.rating;
          review.text = req.body.text;
          review.spoiler = req.body.spoiler;
      
          await review.save();
      
          res.send({ review: review.toJSON() });
        } catch (e) {
          console.log(e);
          res.status(400).send({ error: 'Errore nella modifica della recensione.' });
        }
    },
    async deleteReview(req, res) {
        try {
          const decode = jsonwebtoken.verify(req.headers.authorization.split(' ')[1], config.authentication.jwtSecret);
          const review = await reviews.findOne({ where: { id: req.params.id, UserId: decode.id } });
      
          if (!review) {
            return res.status(404).send({ error: 'Recensione non trovata o non autorizzato.' });
          }
      
          await review.destroy();
      
          res.send({ message: 'Recensione eliminata con successo.' });
        } catch (e) {
          console.log(e);
          res.status(400).send({ error: 'Errore durante l\'eliminazione della recensione.' });
        }
    },
    async likeReview(req, res) {
        try {
          const decode = jsonwebtoken.verify(req.body.token, config.authentication.jwtSecret);
          const review = await reviews.findOne({ where: { id: req.body.review_id } });
      
          if (!review) {
            return res.status(404).send({ error: 'Recensione non trovata.' });
          }
      
          review.like += 1;
          await review.save();
      
          res.send({ like: review.like });
        } catch (e) {
          res.status(400).send({ error: 'Errore durante il like della recensione.' });
        }
      },
      async dislikeReview(req, res) {
        try {
          const decode = jsonwebtoken.verify(req.body.token, config.authentication.jwtSecret);
          const review = await reviews.findOne({ where: { id: req.body.review_id } });
      
          if (!review) {
            return res.status(404).send({ error: 'Recensione non trovata.' });
          }
      
          review.dislike += 1;
          await review.save();
      
          res.send({ dislike: review.dislike });
        } catch (e) {
          res.status(400).send({ error: 'Errore durante il dislike della recensione.' });
        }
      },
      
}