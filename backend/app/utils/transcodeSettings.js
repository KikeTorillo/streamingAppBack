// utils/transcodeSettings.js
const { videoConfig } = require('./configMediaQualities');

/**
 * Calcula las resoluciones basadas en la proporción del video original y
 * en las calidades definidas en config.
 *
 * @param {number} originalWidth - Ancho original del video.
 * @param {number} originalHeight - Alto original del video.
 * @returns {Array} Array de objetos con { w, h, vbr, abr }.
 */
const calculateResolutions = (originalWidth, originalHeight) => {
  const aspectRatio = originalWidth / originalHeight;
  return videoConfig.transcode.baseQualities.map((q) => {
    let newWidth = Math.round(q.h * aspectRatio);
    if (newWidth % 2 !== 0) {
      newWidth += 1;
    }
    return { w: newWidth, h: q.h, vbr: q.vbr, abr: q.abr };
  });
};

/**
 * Determina la calidad máxima (número de niveles) según la altura original.
 *
 * @param {number} originalHeight - Alto original del video.
 * @returns {number} Número de niveles de calidad.
 */
const determineMaxQuality = (originalHeight) => {
  let maxQuality;
  if (originalHeight >= 2160) {
    maxQuality = 5;
  } else if (originalHeight >= 1440) {
    maxQuality = 4;
  } else if (originalHeight >= 1080) {
    maxQuality = 3;
  } else if (originalHeight >= 720) {
    maxQuality = 2;
  } else {
    maxQuality = 1;
  }
  return maxQuality;
};

module.exports = {
  calculateResolutions,
  determineMaxQuality,
};
