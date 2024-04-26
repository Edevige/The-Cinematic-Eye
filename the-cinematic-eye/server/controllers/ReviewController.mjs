import { reviews } from "../models/index.mjs";
import jsonwebtoken from "jsonwebtoken";
import config from "../config/config.mjs";

export default{

    async createReview(req, res){
        try {
            var decode = jsonwebtoken.verify(req.body.token, config.authentication.jwtSecret);


            const review = await reviews.create({film_id: req.body.film_id, text: req.body.text, UserId: decode.id, spoiler: req.body.spoiler});
            res.send({
                review: review.toJSON(),
            }
                ) 
        } catch (e) { 
            console.log(e);
            res.status(400).send({error: 'Unexpected error conctat the system admin'})   
        }

    }

}