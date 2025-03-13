// Importación del módulo personalizado para generar hashes
//const hashName = require('./hashName');

// Lista de servidores CDN disponibles
const CDNS = [
    'localhost:8082', // Servidor CDN 1
    // '192.168.56.3'  // Servidor CDN 2 (descomentar si hay más servidores)
];

// Función para seleccionar aleatoriamente un servidor CDN
function getRandomCdn() {
    return CDNS[Math.floor(Math.random() * CDNS.length)];
}

// Función para generar un hash seguro basado en la expiración y la IP del cliente
function generateSecurePathHash(expires, client_ip) {
    //return hashName(`${expires} ${client_ip}`, true); // Genera un hash único
}

// Función principal para generar la URL del video
const getUrl = async (ipCustomer, name, qualitySelected = '720') => {
    try {
        // Usa el nombre original del archivo
        const videoId = name; // Ya no usamos hashName
        console.log('Video ID:', videoId);

        // Obtiene la dirección IP del cliente
        const ip = ipCustomer;

        // Calcula la marca de tiempo de expiración (1 hora a partir de ahora)
        const expires = String(Math.round(new Date(Date.now() + (1000 * 60 * 60)).getTime() / 1000));

        // Genera un token de seguridad
        const token = generateSecurePathHash(expires, ip);
        console.log('Token generado:', token);

        // Procesa las calidades disponibles
        const qualities = qualitySelected.split(',').map(quality => {
            return quality.slice(0, -1); // Elimina la letra "p" de cada calidad (por ejemplo, "720p" -> "720")
        }).join(',');

        // Construye la URL del archivo HLS master playlist
        const cdnUrl = `http://${getRandomCdn()}/hls/videos/vod/${videoId}/${token}/${expires}/720p.mp4.play/master.m3u8`;
        console.log('URL generada:', cdnUrl);

        return cdnUrl;
    } catch (error) {
        console.error('Error al generar la URL:', error.message);
        throw error;
    }
};

module.exports = { getUrl };