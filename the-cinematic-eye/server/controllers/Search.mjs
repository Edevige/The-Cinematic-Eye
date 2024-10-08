import { Op, where } from "sequelize";
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
      console.error(e);
      res.status(400).send({ error: e });
    }
  },
  async getUser(req, res){
    try {
      const user= await users.findAll();
      const found=[]
      user.forEach((i) => {
        found.push({Username: i.username, id: i.id});
      });
      res.send(found);
    } catch (error) {
      console.log(e);
      res.status(400).send({ error: e });
    }
  },

  async getUserById(req, res){
    try {
      const user= await users.findAll({
        where: {
          id: req.params.id
        }
      });
      res.send(user);
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: error });
    }
  }
};
