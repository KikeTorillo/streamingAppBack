// Esta es una forma de conexion sin hacer pool de conexiones no se usa actualmente en el proyecto
// solo esta como ejemplo
const { Client } = require('pg');

async function getConnection(){
    const client = new Client(
        {
            host: 'localhost',
            port: 5432,
            user: 'kike',
            password: 'admin123',
            database: 'my_api'
        }
    );
    await client.connect();
    return client;
}

module.exports = getConnection;

