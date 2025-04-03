// aws.js
const AWS = require('aws-sdk');
const fs = require('fs');
const stream = require('stream');
const { config } = require('./../config/config'); // Configuración de la aplicación

const s3 = new AWS.S3({
  apiVersion: 'latest',
  accessKeyId: 'admin',
  secretAccessKey: 'admin123',
  endpoint: 'http://localhost:9000',
  region: 'us-east-1',
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});
/**
 * Verifica si un archivo ya existe en MinIO.
 * @param {string} remotePath - Ruta completa del archivo en MinIO (incluyendo subcarpeta).
 * @returns {Promise<boolean>} - Retorna `true` si el archivo existe, `false` si no.
 */async function checkIfFileExistsInMinIO(remotePath) {
  try {
    const params = {
      Bucket: config.bucket,
      Key: remotePath,
    };
    await s3.headObject(params).promise();
    return true;
  } catch (error) {
    if (error.code === 'NotFound') {
      return false;
    }
    throw error;
  }
}

function uploadToMinIO(filePath, remotePath, callback) {
  const pass = new stream.PassThrough();
  const params = {
    Bucket: config.bucket,
    Key: remotePath,
    Body: pass,
    ContentType: 'video/mp4',
  };
  const options = {
    partSize: 1024 * 1024 * 50,
    queueSize: 8,
  };
  const manager = s3.upload(params, options, function (error, data) {
    if (error) {
      console.log('\x1b[31m%s\x1b[0m', 'File not uploaded');
      if (callback) callback(error);
    } else {
      const uploadedFile = data;
      if (uploadedFile && 'Key' in uploadedFile && 'ETag' in uploadedFile) {
        console.log('\x1b[32m%s\x1b[0m', 'uploaded successfully');
        if (callback) callback();
      } else {
        console.log('\x1b[31m%s\x1b[0m', 'File not uploaded');
        if (callback) callback(new Error('Upload verification failed'));
      }
    }
  });

  manager.on('httpUploadProgress', (progress) => {
    console.log(`Uploading ${progress.loaded}/${progress.total} Part ${progress.part} ----> ${remotePath}`);
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(pass);
}

/**
 * Función para eliminar un archivo en MinIO.
 * Se usa el método deleteObject de AWS SDK.
 */
function deleteFromMinIO(remotePath, callback) {
  const params = {
    Bucket: config.bucket,
    Key: remotePath,
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.error(`Error al eliminar el archivo ${remotePath}:`, err);
      return callback(err);
    }
    console.log(`Archivo ${remotePath} eliminado de MinIO`);
    callback();
  });
}

//console.log('\x1b[31m%s\x1b[0m', 'Este texto es rojo');
//console.log('\x1b[32m%s\x1b[0m', 'Este texto es verde');
//console.log('\x1b[33m%s\x1b[0m', 'Este texto es amarillo');
//console.log('\x1b[34m%s\x1b[0m', 'Este texto es azul');


module.exports = {
  uploadToMinIO,
  checkIfFileExistsInMinIO,
  deleteFromMinIO,
};