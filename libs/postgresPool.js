//De esta forma se crea el pool de conexiones para mejor funcionamiento
const { Pool } = require('pg');
const { config } = require('./../config/config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;
let pool;
// Se agrega condicion para realizar la conexion a produccino vercel y en ambiente local
//if (config.isProd) {
//    pool = new Pool({ connectionString: config.postgrURL,});
//}else{
    pool = new Pool({ connectionString: URI,});
//}

module.exports = pool;