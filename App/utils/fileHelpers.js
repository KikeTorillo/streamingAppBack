// utils/fileHelpers.js
const fs = require('fs');

/**
 * Crea un directorio de forma asíncrona si no existe.
 * @param {string} dir - Ruta del directorio a crear.
 */
const createTempDir = async (dir) => {
  try {
    await fs.promises.access(dir);
    console.log(`El directorio ya existe: ${dir}`);
  } catch (err) {
    await fs.promises.mkdir(dir, { recursive: true });
    console.log(`Directorio creado: ${dir}`);
  }
};

/**
 * Elimina un directorio de forma asíncrona.
 * @param {string} dir - Ruta del directorio a eliminar.
 */
const deleteTempDir = async (dir) => {
  try {
    await fs.promises.access(dir);
    await fs.promises.rm(dir, { recursive: true, force: true });
    console.log(`Directorio "${dir}" eliminado correctamente.`);
  } catch (err) {
    console.log(`El directorio "${dir}" no existe o no se pudo eliminar: ${err.message}`);
  }
};

/**
 * Verifica si un archivo existe de forma asíncrona.
 * @param {string} path - Ruta del archivo.
 * @returns {Promise<boolean>} - True si existe, false en caso contrario.
 */
const fileExists = async (path) => {
    try {
      await fs.promises.access(path);
      return true;
    } catch (err) {
      return false;
    }
  };

module.exports = { createTempDir, deleteTempDir, fileExists };
