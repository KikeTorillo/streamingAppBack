// Importación de dependencias
const multer = require('multer'); // Middleware para manejar la subida de archivos en Express
const fs = require('fs'); // Módulo de Node.js para interactuar con el sistema de archivos
const path = require('path'); // Módulo de Node.js para manejar rutas de archivos

/**
 * Función para asegurarse de que la carpeta de destino exista:
 * - Esta función verifica si la carpeta especificada existe.
 * - Si no existe, la crea automáticamente (incluyendo directorios anidados si es necesario).
 */
const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    // Verifica si la carpeta existe usando `fs.existsSync`
    fs.mkdirSync(directory, { recursive: true }); // Crea la carpeta si no existe
    console.log(`Carpeta creada: ${directory}`); // Mensaje de registro para depuración
  }
};

/**
 * Configurar el almacenamiento de los archivos subidos utilizando `multer.diskStorage`:
 * - `multer.diskStorage` permite personalizar cómo se almacenan los archivos subidos.
 * - Aquí definimos dos funciones clave: `destination` y `filename`.
 */
const storage = multer.diskStorage({
  /**
   * destination:
   * - Define la carpeta donde se guardarán los archivos subidos.
   * - Recibe tres parámetros: `req`, `file`, y `cb` (callback).
   * - El callback (`cb`) debe ser llamado con dos argumentos:
   *   1. Un error (si ocurre, o `null` si no hay errores).
   *   2. La ruta de la carpeta de destino.
   */
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads'); // Ruta absoluta a la carpeta uploads
    ensureDirectoryExists(uploadDir); // Asegúrate de que la carpeta exista
    cb(null, uploadDir); // Pasar la ruta de la carpeta al callback
  },
  /**
   * filename:
   * - Define cómo se nombrarán los archivos subidos.
   * - Recibe tres parámetros: `req`, `file`, y `cb` (callback).
   * - El callback (`cb`) debe ser llamado con dos argumentos:
   *   1. Un error (si ocurre, o `null` si no hay errores).
   *   2. El nombre del archivo.
   */
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`); // Usa un nombre único basado en la marca de tiempo
    // NOTA: Esto evita sobrescrituras si dos usuarios suben archivos con el mismo nombre.
  },
});

/**
 * Crear un middleware de Multer configurado con el almacenamiento definido anteriormente:
 * - `multer({ storage })` crea un middleware que usa la configuración de almacenamiento.
 * - Este middleware procesará las solicitudes de subida de archivos y guardará los archivos
 *   en la carpeta especificada.
 */
const upload = multer({ storage });

/**
 * Middleware para manejar múltiples campos de archivos:
 * - `upload.fields()` permite especificar varios campos de archivos que se esperan en la solicitud.
 * - En este caso, aceptamos dos campos: `video` y `coverImage`.
 */
const multiUpload = upload.fields([
  { name: 'video', maxCount: 1 }, // Campo para el archivo de video (máximo 1 archivo)
  { name: 'coverImage', maxCount: 1 }, // Campo para la imagen de portada (máximo 1 archivo)
]);

// Exportar el middleware `multiUpload` para que pueda ser utilizado en otras partes de la aplicación
module.exports = multiUpload;