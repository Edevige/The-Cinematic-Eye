//import fs from 'fs'
//import path from 'path'
//import { fileURLToPath } from 'url';
import { Sequelize, DataTypes } from 'sequelize'
import config from '../config/config.mjs'


const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options
)

import Test from './Test.mjs';

Test(sequelize, DataTypes)



const db = {}

export default {
    db,
    sequelize
}