// Importa el SDK de AWS para interactuar con servicios compatibles como MinIO
const AWS = require('aws-sdk');
// Importa el módulo fs para interactuar con el sistema de archivos local
const fs = require('fs');
// Importa el módulo stream para manejar streams de datos (útil para subir archivos grandes)
const stream = require('stream');

/**
 * Configuración del cliente S3 para MinIO.
 * - Se utiliza el SDK de AWS, pero configurado para trabajar con MinIO.
 */
const s3 = new AWS.S3({
  apiVersion: 'latest', // Versión de la API de S3 a utilizar
  accessKeyId: 'admin', // Clave de acceso configurada en MinIO
  secretAccessKey: 'admin123', // Clave secreta configurada en MinIO
  endpoint: 'http://localhost:9000', // URL del servidor MinIO (cambia si está en otro servidor)
  region: 'us-east-1', // Región obligatoria para AWS SDK, aunque MinIO no usa regiones
  s3ForcePathStyle: true, // Fuerza el uso de estilo de ruta (necesario para MinIO)
  signatureVersion: 'v4', // Versión de firma compatible con MinIO
});

/**
 * Verifica si un archivo ya existe en MinIO.
 * @param {string} remotePath - Ruta completa del archivo en MinIO (incluyendo subcarpeta).
 * @returns {Promise<boolean>} - Retorna `true` si el archivo existe, `false` si no.
 */
async function checkIfFileExistsInMinIO(remotePath) {
  try {
    // Parámetros necesarios para verificar la existencia del archivo
    const params = {
      Bucket: 'videos', // Nombre del bucket en MinIO
      Key: remotePath, // Ruta completa del archivo en MinIO
    };
    // Usa headObject para verificar si el archivo existe
    await s3.headObject(params).promise();
    return true; // El archivo existe
  } catch (error) {
    // Si el error es "NotFound", significa que el archivo no existe
    if (error.code === 'NotFound') {
      return false;
    }
    // Si ocurre otro error, lo lanza para ser manejado por el llamador
    throw error;
  }
}

/**
 * Sube archivos grandes a MinIO utilizando multipart upload.
 * @param {string} filePath - Ruta local del archivo en el sistema de archivos.
 * @param {string} remotePath - Ruta remota del archivo en MinIO (incluyendo subcarpeta).
 * @param {function} callback - Función de callback para manejar el resultado de la subida.
 */
function uploadToMinIO(filePath, remotePath, callback) {
  // Crea un stream passthrough para enviar los datos al bucket
  const pass = new stream.PassThrough();

  // Parámetros necesarios para la subida del archivo
  const params = {
    Bucket: 'videos', // Nombre del bucket en MinIO
    Key: remotePath, // Ruta completa del archivo en MinIO (incluyendo subcarpeta)
    Body: pass, // Stream de datos que se enviará al bucket
    ContentType: 'video/mp4', // Tipo MIME del archivo (en este caso, video MP4)
  };

  // Opciones adicionales para la subida de archivos grandes
  const options = {
    partSize: 1024 * 1024 * 50, // Tamaño de cada parte (50 MB)
    queueSize: 8, // Número máximo de partes que se pueden subir en paralelo
  };

  // Inicia la subida del archivo al bucket de MinIO
  const manager = s3.upload(params, options, function (error, data) {
    if (error) {
      // Si ocurre un error durante la subida, imprime un mensaje y llama al callback con el error
      console.log('\x1b[31m', 'File not uploaded', '\x1b[0m');
      if (callback) callback(error);
    } else {
      // Si la subida es exitosa, verifica que el archivo tenga las propiedades esperadas
      const uploadedFile = data;
      if (uploadedFile && 'Key' in uploadedFile && 'ETag' in uploadedFile) {
        console.log(
          '\x1b[32m',
          `${remotePath} uploaded successfully`,
          '\x1b[0m'
        );
        if (callback) callback(); // Llama al callback sin errores
      } else {
        // Si falla la verificación, imprime un mensaje y llama al callback con un error
        console.log('\x1b[31m', 'File not uploaded', '\x1b[0m');
        if (callback) callback(new Error('Upload verification failed'));
      }
    }
  });

  // Monitorea el progreso de la subida
  manager.on('httpUploadProgress', (progress) => {
    console.log(
      `Uploading ${progress.loaded}/${progress.total} Part ${progress.part} ----> ${remotePath}`
    );
  });

  // Lee el archivo local y lo envía al stream passthrough
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(pass);
}

// Exporta las funciones para que puedan ser utilizadas en otros archivos
module.exports = {
  uploadToMinIO, // Función para subir archivos grandes
  checkIfFileExistsInMinIO, // Función para verificar si un archivo existe en MinIO
};