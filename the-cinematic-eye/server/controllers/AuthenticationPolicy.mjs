import Joi from "joi";

export default {
  register(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().email(), // Deve essere una email valida
      password: Joi.string().regex(new RegExp("^[a-zA-Z0-9]{8,32}$")), // Solo lettere e numeri, minimo 8 e massimo 32 caratteri
      username: Joi.string().regex(new RegExp("^[a-zA-Z0-9]{2,16}$")), // Solo lettere e numeri, minimo 2 e massimo 16 caratteri
      name: Joi.string().regex(new RegExp("^[a-zA-Z ,.'-]+")), // Solo lettere, spazi e alcuni simboli come apostrofi o trattini
      birthdate: Joi.date().iso().less("now"), // Deve essere una data valida nel passato
      subscribed: Joi.boolean(), // Deve essere un valore booleano (vero o falso)
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      switch (error.details[0].context.key) {
        case "email":
          res.status(400).send({
            error: "L'email inserita non è valida. Assicurati di inserire un'email corretta.",
          });
          break;
        case "password":
          res.status(400).send({
            error:
              "La password non è valida. Deve rispettare i seguenti requisiti:<br>- Contenere solo lettere e numeri<br>- Avere almeno 8 caratteri<br>- Non più di 32 caratteri",
          });
          break;
        case "username":
          res.status(400).send({
            error:
              "Il nome utente non è valido. Deve contenere solo lettere e numeri, con una lunghezza compresa tra 2 e 16 caratteri.",
          });
          break;
        case "name":
          res.status(400).send({
            error:
              "Il nome inserito non è valido. Deve contenere solo lettere, spazi e alcuni simboli come virgole, apostrofi o trattini.",
          });
          break;
        case "birthdate":
          res.status(400).send({
            error: "La data di nascita non è valida. Deve essere una data valida nel passato.",
          });
          break;
        case "subscribed":
          res.status(400).send({
            error: "Il valore per la sottoscrizione non è valido. Deve essere 'vero' o 'falso'.",
          });
          break;
        default:
          res.status(400).send({
            error: "Le informazioni inserite non sono valide.",
          });
      }
    } else {
      next(); // Procede se non ci sono errori
    }
  },
};
