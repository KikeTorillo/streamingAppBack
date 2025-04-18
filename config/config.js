// Esta es la configuracion de las variables de entorno
require('dotenv').config();
const config = {
    env: process.env.NODE_ENV || 'dev',
    isProd: process.env.NODE_ENV === 'produccion',
    port: process.env.PORT || 3000,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT,
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
    email: process.env.EMAIL,
    passEmail: process.env.PASSEMAIL,
    urlFront: process.env.NODE_ENV === 'produccion' ? process.env.FRONT_URL_PROD : process.env.FRONT_URL_LOCAL,
    whiteList: process.env.WHITE_lIST,
    bucket: process.env.MINIO_BUCKET,
    videoDir: process.env.MINIO_VIDEO_DIR,
    coversDir: process.env.MINIO_COVERS_DIR,
    tempProcessingDir: process.env.TEMP_PROCESSING_DIR
}

module.exports = {config};