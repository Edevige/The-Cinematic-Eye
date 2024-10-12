import { Op, where } from "sequelize";
import { users, listfilms } from "../models/index.mjs";

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
        found.push({ Username: i.username, Id: i.id });
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
  },
  async getUserByUsername(req, res) {
    try {
      const user = await users.findOne({
        where: { username: req.params.username },
        attributes: ['username', 'email', 'name', 'birthdate', 'bio', 'favorites', 'seen', 'lists', 'seguiti', 'private', 'id']
      });
      
      if (!user) {
        return res.status(404).send({ error: 'Utente non trovato' });
      }
  
      res.send(user);
    } catch (error) {
      console.error('Errore nel recupero dati utente:', error);
      res.status(500).send({ error: 'Errore del server' });
    }
  },
  async listSearch(req, res) {
    try {
      const user = await listfilms.findAll({
        where: {
          title: {
            [Op.like]: "%" + req.query.q + "%",
          },
        },
      });
      const found = [];
      user.forEach((i) => {
        found.push({ Title: i.title, Id: i.id });
      });
      res.send(found);
    } catch (e) {
      console.error(e);
      res.status(400).send({ error: e });
    }
  },
};
