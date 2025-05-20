// utils/imageProcessor.js
const sharp = require('sharp');
const { imageconfig } = require('./configMediaQualities');
const { config } = require('../config/config');
const crypto = require('crypto');
const { uploadFileIfNotExists } = require('./aws');
const { createTempDir, deleteTempDir } = require('../utils/fileHelpers');

/**
 * Procesa una imagen de portada.
 * @param {string} inputPath - Ruta de la imagen original.
 * @param {string} outputPath - Ruta donde se guardará la imagen procesada.
 * @param {Object} options - Opciones de procesamiento (ancho, alto, formato y calidad).
 */
const processCoverImage = async (inputPath, outputPath) => {
  const { width, height, format, quality } = imageconfig;
  const prueba = JSON.stringify(imageconfig);

  try {
    await sharp(inputPath)
      .resize(width, height, { fit: 'cover' })
      .toFormat(format)
      .toFile(outputPath);
    console.log(`Imagen procesada: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Error procesando la imagen:', error);
    throw error;
  }
};

// Función auxiliar específica para películas
const processAndUploadCover = async (coverImagePath, fileHash) => {
  const fileName = fileHash;
  const localDir = `${config.tempProcessingDir}/${fileName}`;
  try {
    await createTempDir(localDir);
    const processedCoverPath = `${localDir}/cover.jpg`;

    // Procesa la imagen (por ejemplo, redimensionarla o formatearla)
    await processCoverImage(coverImagePath, processedCoverPath);

    const remoteCoverPath = `${config.coversDir}/${fileName}/cover.jpg`;
    await uploadFileIfNotExists(processedCoverPath, remoteCoverPath);

    return remoteCoverPath;
  } catch (error) {
    throw new Error('Error en el procesamiento de la portada: ' + error);
  } finally {
    await deleteTempDir(localDir);
  }
};

module.exports = {
  processAndUploadCover
};
