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
if mc ls myminio/${MINIO_BUCKET} > /dev/null 2>&1; then
  echo "El bucket ${MINIO_BUCKET} ya existe."
else
  echo "Creando el bucket..."
  mc mb myminio/${MINIO_BUCKET}
fi

# Crear un objeto vacío para la subcarpeta 'vod'
#echo "Creando la subcarpeta 'vod' dentro del bucket 'videos'..."
#mc cp /dev/null myminio/${MINIO_BUCKET}/vod/

echo "Inicialización completada."