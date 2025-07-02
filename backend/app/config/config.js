const config = {
    whiteList: process.env.WHITE_LIST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.IP_ADDRESS_POSTGRESQL,
    dbPort: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
    urlFront:process.env.FRONT_URL_LOCAL,
    email: process.env.EMAIL,
    passEmail: process.env.PASS_EMAIL,
    coversDir: process.env.MINIO_COVERS_DIR,
    videoDir: process.env.MINIO_VIDEO_DIR,
    minioUser: process.env.MINIO_ROOT_USER,
    minioPass: process.env.MINIO_ROOT_PASSWORD,
    minioHost: process.env.IP_ADDRESS_MINIO,
    bucket: process.env.MINIO_BUCKET,
    tempProcessingDir: process.env.TEMP_PROCESSING_DIR,
    backPort: process.env.BACK_PORT
}

module.exports = {config};