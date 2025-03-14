// utils/imageProcessor.js
const sharp = require('sharp');

/**
 * Procesa una imagen de portada.
 * @param {string} inputPath - Ruta de la imagen original.
 * @param {string} outputPath - Ruta donde se guardará la imagen procesada.
 * @param {Object} options - Opciones de procesamiento (ancho, alto, formato y calidad).
 */
const processCoverImage = async (inputPath, outputPath, options = {}) => {
  const {
    width = 640,
    height = 360,
    format = 'jpeg',
    quality = 80
  } = options;

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

module.exports = {
  processCoverImage,
};
