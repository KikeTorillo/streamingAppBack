// utils/minioHelpers.js
const { uploadToMinIO, checkIfFileExistsInMinIO } = require('./aws');

/**
 * Verifica si el archivo existe en MinIO y, si no, lo sube.
 * @param {string} localPath - Ruta local del archivo.
 * @param {string} remotePath - Ruta remota en MinIO.
 * @returns {Promise<void>}
 */
const uploadFileIfNotExists = async (localPath, remotePath) => {
  const exists = await checkIfFileExistsInMinIO(remotePath);
  if (exists) {
    console.log(`El archivo ${remotePath} ya existe en MinIO. Saltando...`);
    return;
  }
  
  return new Promise((resolve, reject) => {
    uploadToMinIO(localPath, remotePath, (error) => {
      if (error) {
        console.error(`Error al subir el archivo a MinIO: ${remotePath}`, error);
        return reject(error);
      }
      console.log(`Archivo subido a MinIO: ${remotePath}`);
      resolve();
    });
  });
};

module.exports = { uploadFileIfNotExists };
