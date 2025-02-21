#!/bin/sh

# Instalar curl y mc (MinIO Client)
apk add --no-cache curl bash && \
wget https://dl.min.io/client/mc/release/linux-amd64/mc && \
chmod +x mc && \
mv mc /usr/local/bin/

# Esperar a que MinIO esté listo
echo "Esperando a que MinIO esté disponible..."
until curl -s http://${MINIO_HOST}:9000/minio/health/live; do
  echo "MinIO no está listo todavía, reintentando en 5 segundos..."
  sleep 5
done

echo "MinIO está listo."

# Configurar el cliente MinIO (mc)
mc alias set myminio http://${MINIO_HOST}:9000 ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD}

# Crear el bucket 'videos'
if mc ls myminio/videos > /dev/null 2>&1; then
  echo "El bucket 'videos' ya existe."
else
  echo "Creando el bucket 'videos'..."
  mc mb myminio/videos
fi

# Crear un objeto vacío para la subcarpeta 'vod'
echo "Creando la subcarpeta 'vod' dentro del bucket 'videos'..."
mc cp /dev/null myminio/videos/vod/

echo "Inicialización completada."