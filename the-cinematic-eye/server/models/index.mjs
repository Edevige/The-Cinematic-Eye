//import fs from 'fs'
//import path from 'path'
//import { fileURLToPath } from 'url';
import { Sequelize, DataTypes } from 'sequelize'
import config from '../config/config.mjs'


const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options,
    
)


import Users from './Users.mjs';

const users = Users(sequelize, DataTypes);

import Reviews from './Reviews.mjs';

const reviews = Reviews(sequelize, DataTypes, users);

import ListFilms from './ListFilm.mjs';

const listfilms = ListFilms(sequelize, DataTypes, users);

import URIs from './URI.mjs';

const uris = URIs(sequelize, DataTypes, users, reviews);

const db = {
    
}

export {
    db,
    sequelize,
    users,
    reviews,
    listfilms,
    uris
}

