import { reviews } from "../models/index.mjs";
import { uris as URIs } from "../models/index.mjs";
import { reviews as Reviews } from "../models/index.mjs";
import { users } from "../models/index.mjs";
import { userroles } from "../models/index.mjs";
import jsonwebtoken from "jsonwebtoken";
import config from "../config/config.mjs";

export default{

    async createReview(req, res) {
        try {
            const decoded = jsonwebtoken.verify(req.body.token, config.authentication.jwtSecret);
            const userId = decoded.id;
            const { film_id, text, rating, spoiler } = req.body;
    
            // Controlla se esiste già una recensione dello stesso utente per lo stesso film
            const existingReview = await reviews.findOne({ where: { film_id, UserId: userId } });
            
            if (existingReview) {
                // Se la recensione esiste, restituisci un errore chiaro
                return res.status(400).send({ error: 'Hai già scritto una recensione per questo film.' });
            }
    
            // Crea la nuova recensione se non esiste
            const review = await reviews.create({
                film_id,
                text,
                UserId: userId,
                spoiler,
                rating
            });
            
            res.send({ review: review.toJSON() });
        } catch (e) {
            console.log(e);
            res.status(400).send({ error: 'Errore inatteso. Contatta l’amministratore di sistema.' });
        }
    },
    async getFilmReviews(req, res) {
        try {
            const found = await reviews.findAll({
                where: { film_id: req.body.film_id },
                include: [{
                    model: users,  // Includi il modello Users
                    attributes: ['username']  // Recupera solo il campo username
                }]
            });
    
            res.send({
                reviews: found
            });
        } catch (e) {
            console.log(e);
            res.status(400).send({ error: 'Errore inatteso, contatta l’amministratore di sistema' });
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
            // Decodifica il token e ottieni l'ID dell'utente loggato
            const decoded = jsonwebtoken.verify(req.headers.authorization.split(' ')[1], config.authentication.jwtSecret);
            const userId = decoded.id;
    
            // Trova la recensione da aggiornare in base all'ID della recensione
            const review = await reviews.findOne({ where: { id: req.body.id } });
            
            if (!review) {
                return res.status(404).send({ error: 'Recensione non trovata.' });
            }
    
            // Trova se l'utente loggato è un amministratore nella tabella userroles
            const admin = await userroles.findOne({ where: { UserId: userId, role: 1 } });
    
            // Controlla se l'utente è l'autore della recensione o un amministratore
            if (review.UserId !== userId && !admin) {
                return res.status(403).send({ error: 'Non sei autorizzato a modificare questa recensione.' });
            }
    
            // Aggiorna solo lo stato dello spoiler se l'utente è autorizzato
            review.spoiler = req.body.spoiler !== undefined ? req.body.spoiler : review.spoiler;
            review.rating = req.body.rating;
            review.text = req.body.text;

            await review.save();  // Salva le modifiche nel database
    
            // Invia la recensione aggiornata come risposta
            res.send({ review: review.toJSON() });
        } catch (e) {
            console.error('Errore nella modifica della recensione:', e);
            res.status(400).send({ error: 'Errore nella modifica della recensione.' });
        }
    },
    
    async deleteReview(req, res) {
        try {
          const decode = jsonwebtoken.verify(req.headers.authorization.split(' ')[1], config.authentication.jwtSecret);
          const userId = decode.id;
          const review = await reviews.findOne({ where: { id: req.params.id, } });
          
          // Trova se l'utente loggato è un amministratore nella tabella userroles
          const admin = await userroles.findOne({ where: { UserId: userId, role: 1 } });
    
          // Controlla se l'utente è l'autore della recensione o un amministratore
          if (review.UserId !== userId && !admin) {
              return res.status(403).send({ error: 'Non sei autorizzato a modificare questa recensione.' });
          }

          if (!review) {
            return res.status(404).send({ error: 'Recensione non trovata o non autorizzato.' });
          }
          
          await URIs.destroy({where: {ReviewId: req.params.id}});

          await review.destroy();
      
          res.send({ message: 'Recensione eliminata con successo.' });
        } catch (e) {
          console.log(e);
          res.status(400).send({ error: 'Errore durante l\'eliminazione della recensione.' });
        }
    },
    
    async toggleLikeDislike(req, res) {
      try {
          console.log("Dati ricevuti per toggleLikeDislike:", req.body);
          const { token, review_id, like } = req.body;
    
          if (!token || !review_id) {
              return res.status(400).send({ error: 'Parametri mancanti.' });
          }
    
          const decode = jsonwebtoken.verify(token, config.authentication.jwtSecret);
          const userId = decode.id;
          const reviewId = review_id;
    
          const review = await Reviews.findOne({ where: { id: reviewId } });
          if (!review) {
              return res.status(404).send({ error: 'Recensione non trovata.' });
          }
    
          let interaction = await URIs.findOne({ where: { UserId: userId, ReviewId: reviewId } });
    
          if (!interaction) {
              interaction = await URIs.create({
                  UserId: userId,
                  ReviewId: reviewId,
                  liked: like === true,
                  disliked: like === false
              });
    
              if (like) {
                  review.like += 1;
              } else {
                  review.dislike += 1;
              }
          } else {
              if (like) {
                  if (interaction.liked) {
                      interaction.liked = false;
                      review.like -= 1;
                  } else {
                      interaction.liked = true;
                      review.like += 1;
                      if (interaction.disliked) {
                          interaction.disliked = false;
                          review.dislike -= 1;
                      }
                  }
              } else {
                  if (interaction.disliked) {
                      interaction.disliked = false;
                      review.dislike -= 1;
                  } else {
                      interaction.disliked = true;
                      review.dislike += 1;
                      if (interaction.liked) {
                          interaction.liked = false;
                          review.like -= 1;
                      }
                  }
              }
          }
    
          await interaction.save();
          console.log("Interazione salvata:", interaction);
          await review.save();
          console.log("Recensione aggiornata:", review);
    
          res.send({ like: review.like, dislike: review.dislike });
      } catch (e) {
          console.error("Errore durante toggleLikeDislike:", e);
          //res.status(400).send({ error: 'Impossibile caricare like/dislike per questa recensione.' });
      }
    },
    

}