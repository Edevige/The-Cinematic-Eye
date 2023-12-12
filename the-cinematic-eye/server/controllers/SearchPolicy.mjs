import Joi from "joi";

export default {
  usrSearch(req, res, next) {
    const schema = Joi.object({
      q: Joi.string().min(2),
    });

    const { error, value } = schema.validate(req.query);
    if (error) {
      switch (error.details[0].context.key) {
        case "q":
          res.status(400).send({
            error: "Invalid q, can't be null or shorter than 2 characters",
          });
          break;
        default:
          res.status(400).send({
            error: "Invalid query",
          });
      }
    } else {
      next();
    }
  },
};
