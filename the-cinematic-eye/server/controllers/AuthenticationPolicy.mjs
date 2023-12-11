import Joi from "joi";

export default {
  register(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().email(),
      password: Joi.string().regex(new RegExp("^[a-zA-Z0-9]{8,32}$")),
      username: Joi.string().regex(new RegExp("^[a-zA-Z0-9]{2,16}$")),
      name: Joi.string().regex(new RegExp("^[a-zA-Z ,.'-]+")),
      birthdate: Joi.date().iso().less("now"),
      subscribed: Joi.boolean(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      switch (error.details[0].context.key) {
        case "email":
          res.status(400).send({
            error: "Invalid email",
          });
          break;
        case "password":
          res.status(400).send({
            error:
              "Invalid password <br> Must contain:<br> a lowercase letter<br>a uppercase letter<br>a number<br>at least 8 characters<br>at maximum 32 characters",
          });
          break;
        case "username":
          res.status(400).send({
            error:
              "Invalid username <br> Valid characters:<br>lowercase letters<br>uppercase letters<br>numbers<br>at least 2 characters<br>at maximum 16 characters",
          });
          break;
        case "name":
          res.status(400).send({
            error:
              "Invalid name <br> Valid characters:<br>lowercase letters<br>uppercase letters<br>spaces",
          });
          break;
        case "date":
          res.status(400).send({
            error: "Invalid date",
          });
          break;
        case "subscribed":
          res.status(400).send({
            error: "Invalid subscrition value",
          });
          break;
        default:
          res.status(400).send({
            error: "Invalid registration info",
          });
      }
    } else {
      next();
    }
  },
};
