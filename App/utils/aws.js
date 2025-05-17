// aws.js
const AWS = require('aws-sdk');
const fs = require('fs');
const stream = require('stream');
const { config } = require('../config/config'); // Configuración de la aplicación
const mime = require('mime-types');

const s3 = new AWS.S3({
  apiVersion: 'latest',
  accessKeyId: config.minioUser,
  secretAccessKey: config.minioPass,
  endpoint: 'http://localhost:9000',
  region: 'us-east-1',
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});
/**
 * Verifica si un archivo ya existe en MinIO.
 * @param {string} remotePath - Ruta completa del archivo en MinIO (incluyendo subcarpeta).
 * @returns {Promise<boolean>} - Retorna `true` si el archivo existe, `false` si no.
 */ async function checkIfFileExistsInMinIO(remotePath) {
  const params = { Bucket: config.bucket, Key: remotePath };
  try {
    await s3.headObject(params).promise();
    return true;
  } catch (error) {
    if (error.code === 'NotFound') return false;
    throw error;
  }
}

async function uploadToMinIO(filePath, remotePath) {
  const pass = new stream.PassThrough();
  const contentType = mime.lookup(remotePath) || 'application/octet-stream';

  const params = {
    Bucket: config.bucket,
    Key: remotePath,
    Body: pass,
    ContentType: contentType,
  };
  const options = {
    partSize: 1024 * 1024 * 50,
    queueSize: 8,
  };

  // Iniciar el multipart upload
  const upload = s3.upload(params, options);

  // Log de progreso
  upload.on('httpUploadProgress', (progress) => {
    console.log(
      `Uploading ${progress.loaded}/${progress.total} bytes, part ${progress.part} -> ${remotePath}`
    );
  });

  // Crear el stream de lectura y manejar errores en él
  const readStream = fs.createReadStream(filePath);
  readStream.on('error', (err) => {
    // Abortamos la subida y destruye el PassThrough para liberar recursos
    upload.abort();
    pass.destroy();
    throw err;
  });

  // Encadena los streams
  readStream.pipe(pass);

  try {
    const data = await upload.promise();

    // Verificación de que efectivamente se subió
    if (!data || !data.Key || !data.ETag) {
      throw new Error('Upload verification failed');
    }

    console.log(`\x1b[32mArchivo subido: ${remotePath}\x1b[0m`);
    return data;
  } catch (err) {
    // En caso de error, nos aseguramos de limpiar el PassThrough
    pass.destroy();
    throw err;
  }
}


/**
 * Verifica si el archivo existe en MinIO y, si no, lo sube.
 * @param {string} localPath - Ruta local del archivo.
 * @param {string} remotePath - Ruta remota en MinIO.
 * @returns {Promise<void>}
 */ async function uploadFileIfNotExists(localPath, remotePath) {
  const exists = await checkIfFileExistsInMinIO(remotePath);
  if (exists) {
    console.log(`\x1b[33mArchivo ${remotePath} ya existe.\x1b[0m`);
    return;
  }

  try {
    await uploadToMinIO(localPath, remotePath);
  } catch (error) {
    console.error(`\x1b[31mError subiendo ${remotePath}: ${error.message}\x1b[0m`);
    throw error;
  }
}

async function deleteFromMinIO(remotePath) {
  if (typeof remotePath !== 'string' || !remotePath.trim()) {
    throw new Error('La ruta remota debe ser una cadena no vacía');
  }
  const params = { Bucket: config.bucket, Key: remotePath };
  await s3.deleteObject(params).promise();
  console.log(`Archivo eliminado: ${remotePath}`);
}

async function listAllKeys(prefix) {
  const params = { Bucket: config.bucket, Prefix: prefix };
  let keys = [];
  let ContinuationToken;
  do {
    const resp = await s3.listObjectsV2({ ...params, ContinuationToken }).promise();
    keys = keys.concat(resp.Contents.map(o => o.Key));
    ContinuationToken = resp.IsTruncated ? resp.NextContinuationToken : null;
  } while (ContinuationToken);
  return keys;
}

async function deleteKeys(keys) {
  const batches = [];
  for (let i = 0; i < keys.length; i += 1000) {
    batches.push(keys.slice(i, i + 1000));
  }
  for (const batch of batches) {
    const params = {
      Bucket: config.bucket,
      Delete: { Objects: batch.map(Key => ({ Key })) },
    };
    const resp = await s3.deleteObjects(params).promise();
    if (resp.Errors && resp.Errors.length) {
      console.warn('Errores al eliminar objetos:', resp.Errors);
    }
  }
}

async function deleteFilesByPrefix(prefix) {
  if (typeof prefix !== 'string' || !prefix.trim()) {
    throw new Error('El prefijo debe ser una cadena no vacía');
  }
  const keys = await listAllKeys(prefix);
  if (keys.length === 0) {
    console.log(`No hay archivos con prefijo: ${prefix}`);
    return;
  }
  console.log(`Borrando ${keys.length} archivos con prefijo '${prefix}'…`);
  await deleteKeys(keys);
  console.log('Eliminación en lote completada');
}

//console.log('\x1b[31m%s\x1b[0m', 'Este texto es rojo');
//console.log('\x1b[32m%s\x1b[0m', 'Este texto es verde');
//console.log('\x1b[33m%s\x1b[0m', 'Este texto es amarillo');
//console.log('\x1b[34m%s\x1b[0m', 'Este texto es azul');

module.exports = {
  uploadToMinIO,
  checkIfFileExistsInMinIO,
  uploadFileIfNotExists,
  deleteFromMinIO,
  deleteFilesByPrefix,
};
