#!/bin/sh

# Reemplaza las variables de entorno en el archivo de plantilla
# Solo las variables que realmente se usan en las nuevas configuraciones
envsubst '${NGINX_TRANSCODER1} ${NGINX_TRANSCODER2} ${NGINX_MINIO_SERVER} ${NGINX_MINIO_ACCESS_KEY} ${NGINX_SECRET_KEY} ${NGINX_REGION} ${NGINX_MINIO_BUCKET} ${NGINX_MINIO_VIDEO_DIR} ${NGINX_MINIO_COVERS_DIR}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Debug: Mostrar configuración generada (comentar en producción)
echo "=== CONFIGURACIÓN NGINX GENERADA ==="
cat /etc/nginx/nginx.conf
echo "=== FIN CONFIGURACIÓN ==="

# Validar la configuración antes de iniciar
nginx -t

# Si la validación es exitosa, inicia Nginx
if [ $? -eq 0 ]; then
    echo "✅ Configuración de Nginx válida. Iniciando servidor..."
    exec nginx -g "daemon off;"
else
    echo "❌ Error en la configuración de Nginx. Revisar logs."
    exit 1
fi