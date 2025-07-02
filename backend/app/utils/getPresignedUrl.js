// minioHelper.js
const Minio = require('minio');

// Configuración del cliente MinIO
const minioClient = new Minio.Client({
  endPoint: 'localhost',      // Por ejemplo: 'play.min.io' o la IP de tu servidor
  port: 9000,                 // Puerto de MinIO (por defecto es 9000)
  useSSL: false,              // Cambia a true si usas HTTPS
  accessKey: '', // Tu clave de acceso
  secretKey: ''  // Tu clave secreta
});

/**
 * Función que genera una URL prefirmada para acceder a un objeto en MinIO.
 * @param {string} bucketName - Nombre del bucket.
 * @param {string} objectName - Ruta del objeto dentro del bucket.
 * @param {number} expiry - Tiempo de expiración en segundos (por defecto 1 día).
 * @returns {Promise<string>} - Promesa que resuelve con la URL prefirmada.
 */
function getPresignedUrl(bucketName, objectName, expiry = 24 * 60 * 60) {
  return new Promise((resolve, reject) => {
    minioClient.presignedGetObject(bucketName, objectName, expiry, (err, url) => {
      if (err) {
        return reject(err);
      }
      resolve(url);
    });
  });
}

// Exportamos la función para poder usarla en otros archivos
module.exports = {
  getPresignedUrl,
};
