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
      console.log('UTENTI TROVATI: ', user);
      
      user.forEach((i) => {
        found.push({Username: i.username, id: i.id});
      });
      console.log('HO TROVATO: ', found);
      res.send(found);
    } catch (error) {
      console.log(e);
      res.status(400).send({ error: e });
    }
  }
};
