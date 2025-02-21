// Importación de dependencias
const AWS = require('aws-sdk'); // SDK de AWS para interactuar con servicios de AWS (o compatibles como Wasabi)
const fs = require('fs'); // Módulo de Node.js para interactuar con el sistema de archivos
const stream = require('stream'); // Módulo de Node.js para manejar streams de datos

// Configuración del cliente S3 para Wasabi
const s3 = new AWS.S3({
    apiVersion: 'latest',
    accessKeyId: 'admin', // Clave de acceso configurada en MinIO
    secretAccessKey: 'admin123', // Clave secreta configurada en MinIO
    endpoint: 'http://localhost:9000', // Cambia si MinIO está en otro servidor
    region: 'us-east-1', // MinIO no usa regiones por defecto, pero es obligatorio en AWS SDK
    s3ForcePathStyle: true, // Requerido para MinIO
    signatureVersion: 'v4' // Compatible con MinIO
});

// Función para subir archivos grandes a Wasabi
function UploadLargeFiles(filePath, callback) {
    // Stream de paso para manejar la transferencia de datos
    const pass = new stream.PassThrough();

    // Parámetros para la subida del archivo
    const params = {
        Bucket: 'videos', // Nombre del bucket en Wasabi
        Key: filePath, // Nombre del archivo en el bucket (puede ser la ruta completa)
        Body: pass, // Stream de datos que se enviará al bucket
        ContentType: 'video/mp4' // Tipo MIME del archivo (en este caso, video MP4)
    };

    // Opciones de multipart upload
    const options = {
        partSize: 1024 * 1024 * 50, // Tamaño de cada parte (50 MB)
        queueSize: 8 // Número máximo de partes que se pueden subir en paralelo
    };

    // Inicia la subida del archivo
    const manager = s3.upload(params, options, function (error, data) {
        if (error) {
            // Mensaje de error en rojo
            console.log('\x1b[31m', 'File not uploaded', '\x1b[0m');
            if (callback) callback(error); // Llama al callback con el error
        } else {
            const uploadedFile = data;
            // Verifica si el archivo se subió correctamente
            if (uploadedFile && 'Key' in uploadedFile && 'ETag' in uploadedFile) {
                // Mensaje de éxito en verde
                console.log('\x1b[32m', `${filePath} uploaded successfully`, '\x1b[0m');
                if (callback) callback(); // Llama al callback sin errores
            } else {
                // Mensaje de error en rojo
                console.log('\x1b[31m', 'File not uploaded', '\x1b[0m');
                if (callback) callback(new Error('Upload verification failed')); // Llama al callback con un error
            }
        }
    });

    // Manejo del progreso de la subida
    manager.on('httpUploadProgress', (progress) => {
        console.log(`Uploading ${progress.loaded}/${progress.total} Part ${progress.part} ----> ${filePath}`);
    });

    // Stream de lectura del archivo local
    const readStream = fs.createReadStream(filePath);

    // Conecta el stream de lectura con el stream de paso
    readStream.pipe(pass);
}

// Exporta la función para que pueda ser usada en otros módulos
module.exports = {
    upload: UploadLargeFiles
};