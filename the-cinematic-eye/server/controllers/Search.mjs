import { Op } from "sequelize";
import { users } from "../models/index.mjs";

export default {
  async usrSearch(req, res) {
    try {
      const user = await users.findAll({
        where: {
          username: {
            [Op.like]: "%" + req.query.q + "%",
          },
        },
      });
      const found = [];
      user.forEach((i) => {
        found.push({ Username: i.username });
      });
      res.send(found);
    } catch (e) {
      console.log(e);
      res.status(400).send({ error: e });
    }
  },
};
