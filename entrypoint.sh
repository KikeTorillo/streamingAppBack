#!/bin/sh

# Reemplaza las variables de entorno en el archivo de plantilla
envsubst '${NGINX_IP_ADDRESS} ${NGINX_SERVER1_PORT} ${NGINX_SERVER2_PORT} ${NGINX_TRANSCODER1} ${NGINX_TRANSCODER2} ${NGINX_MINIO_SERVER} ${NGINX_MINIO_ACCESS_KEY} ${NGINX_SECRET_KEY} ${NGINX_REGION}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Inicia Nginx en primer plano (necesario para Docker)
exec nginx -g "daemon off;"