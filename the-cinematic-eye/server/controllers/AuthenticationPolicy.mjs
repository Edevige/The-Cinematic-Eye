import Joi from "joi";

export default {
  register(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().email(),
      password: Joi.string().regex(new RegExp("^[a-zA-Z0-9]{8,32}$")),
      username: Joi.string().regex(new RegExp("^[a-zA-Z0-9]{2,16}$")),
      name: Joi.string().regex(new RegExp("^(?![s.]+$)[a-zA-Zs.]*$")),
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
