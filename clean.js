const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Función para detener los contenedores
function stopContainers() {
  try {
    console.log('Deteniendo contenedores...');
    execSync('docker compose down --volumes --remove-orphans', { stdio: 'inherit' }); // Ejecuta "docker-compose down"
    console.log('Contenedores detenidos.');
  } catch (error) {
    console.error('Error al detener los contenedores:', error.message);
    process.exit(1); // Termina el proceso si hay un error
  }
}

// Función para eliminar carpetas locales
function deleteLocalFolders(folders) {
  console.log('Eliminando carpetas locales...');
  folders.forEach((folder) => {
    const fullPath = path.resolve(folder); // Resuelve la ruta absoluta
    if (fs.existsSync(fullPath)) {
      try {
        fs.rmSync(fullPath, { recursive: true, force: true }); // Elimina la carpeta recursivamente
        console.log(`Carpeta eliminada: ${fullPath}`);
      } catch (error) {
        console.error(`Error al eliminar la carpeta ${fullPath}:`, error.message);
      }
    } else {
      console.log(`La carpeta no existe: ${fullPath}`);
    }
  });
}

// Función para eliminar el contenido de las carpetas locales
function deleteContentLocalFolders(folders) {
  console.log('Eliminando contenido de carpetas locales...');
  folders.forEach((folder) => {
    const fullPath = path.resolve(folder);
    if (fs.existsSync(fullPath)) {
      try {
        const items = fs.readdirSync(fullPath);
        for (const item of items) {
          const itemPath = path.join(fullPath, item);
          fs.rmSync(itemPath, { recursive: true, force: true });
        }
        console.log(`Contenido eliminado en: ${fullPath}`);
      } catch (error) {
        console.error(`Error al limpiar la carpeta ${fullPath}:`, error.message);
      }
    } else {
      console.log(`La carpeta no existe (se creará si es necesaria más adelante): ${fullPath}`);
    }
  });
}

// Carpetas locales que deben ser eliminadas
const localFolders = [
  './servers/cdn/nginx_cache',
  './servers/transcoderServers/transcoder1/nginx_cache',
  './servers/transcoderServers/transcoder2/nginx_cache',
  './servers/minio/aws3DataMinio',
  './servers/postgresQl/postgres_data',
  './backend/app/uploads',
  './backend/app/vod',
  './backend/app/tempProcessinDir'
];

// Ejecutar el proceso
try {
  stopContainers(); // Detener los contenedores
  deleteContentLocalFolders(localFolders); // Eliminar las carpetas locales
  console.log('Limpieza completada.');
} catch (error) {
  console.error('Error durante la limpieza:', error.message);
  process.exit(1); // Termina el proceso si hay un error
}