//De esta forma se crea el pool de conexiones para mejor funcionamiento
const { Pool } = require('pg');
const { config } = require('./../config/config');
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);

const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;
let pool;
    pool = new Pool({ connectionString: URI,});

module.exports = pool;