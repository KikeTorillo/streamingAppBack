// utils/minioHelpers.js
const {
  uploadToMinIO,
  checkIfFileExistsInMinIO,
  deleteFromMinIO,
} = require('./aws');
/**
 * Verifica si el archivo existe en MinIO y, si no, lo sube.
 * @param {string} localPath - Ruta local del archivo.
 * @param {string} remotePath - Ruta remota en MinIO.
 * @returns {Promise<void>}
 */ const uploadFileIfNotExists = async (localPath, remotePath) => {
  const exists = await checkIfFileExistsInMinIO(remotePath);
  if (exists) {
    console.log(
      '\x1b[31m%s\x1b[0m',
      `El archivo ${remotePath} ya existe en MinIO. Saltando...`
    );
    return;
  }

  return new Promise((resolve, reject) => {
    uploadToMinIO(localPath, remotePath, (error) => {
      if (error) {
        console.error(
          `Error al subir el archivo a MinIO: ${remotePath}`,
          error
        );
        return reject(error);
      }
      console.log('\x1b[32m%s\x1b[0m', `Archivo subido a MinIO: ${remotePath}`);
      resolve();
    });
  });
};

const deleteFileFromMinIO = async (remotePath) => {
  return new Promise((resolve, reject) => {
    deleteFromMinIO(remotePath, (err) => {
      if (err) {
        console.error(
          `Error al eliminar el archivo de MinIO: ${remotePath}`,
          err
        );
        return reject(err);
      }
      console.log(
        '\x1b[32m%s\x1b[0m',
        `Archivo eliminado de MinIO: ${remotePath}`
      );
      resolve();
    });
  });
};

module.exports = { uploadFileIfNotExists, deleteFileFromMinIO };
