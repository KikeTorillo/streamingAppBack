FROM ubuntu:22.04
ENV DEBIAN_FRONTEND=noninteractive

# Instalar dependencias (incluyendo ca-certificates y gettext para envsubst)
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    git \
    libpcre3-dev \
    libssl-dev \
    zlib1g-dev \
    ffmpeg \
    libavcodec-dev \
    libavformat-dev \
    libavutil-dev \
    libxml2-dev \
    libxml2 \
    wget \
    tar \
    curl \
    ca-certificates \
    iputils-ping \
    nano \
    net-tools \
    gettext \
    && apt-get purge -y nginx* \
    && rm -rf /var/lib/apt/lists/*

# Crear directorio para módulos
RUN mkdir -p /modules

# Descargar módulos con curl (maneja mejor las redirecciones)
RUN cd /modules && \
    # Módulo VOD
    curl -L -o nginx-vod-module-1.33.tar.gz https://github.com/kaltura/nginx-vod-module/archive/refs/tags/1.33.tar.gz && \
    tar -zxvf nginx-vod-module-1.33.tar.gz && \
    # Módulo AWS Auth
    curl -L -o nginx-aws-auth-module-1.1.tar.gz https://github.com/kaltura/nginx-aws-auth-module/archive/refs/tags/1.1.tar.gz && \
    tar -zxvf nginx-aws-auth-module-1.1.tar.gz && \
    # Módulo Secure Token
    curl -L -o nginx-secure-token-module-1.5.tar.gz https://github.com/kaltura/nginx-secure-token-module/archive/refs/tags/1.5.tar.gz && \
    tar -zxvf nginx-secure-token-module-1.5.tar.gz

# Descargar y compilar Nginx
ARG NGINX_VERSION=1.26.3
RUN wget https://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz && \
    tar -zxvf nginx-${NGINX_VERSION}.tar.gz && \
    rm nginx-${NGINX_VERSION}.tar.gz

# Configurar y compilar
RUN cd nginx-${NGINX_VERSION} && \
    ./configure \
    --prefix=/etc/nginx \
    --sbin-path=/usr/sbin/nginx \
    --modules-path=/usr/lib/nginx/modules \
    --conf-path=/etc/nginx/nginx.conf \
    --error-log-path=/var/log/nginx/error.log \
    --http-log-path=/var/log/nginx/access.log \
    --pid-path=/var/run/nginx.pid \
    --lock-path=/var/run/nginx.lock \
    --http-client-body-temp-path=/var/cache/nginx/client_temp \
    --http-proxy-temp-path=/var/cache/nginx/proxy_temp \
    --http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp \
    --http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp \
    --http-scgi-temp-path=/var/cache/nginx/scgi_temp \
    --with-http_ssl_module \
    --with-http_v2_module \
    --with-http_stub_status_module \
    --with-http_realip_module \
    --with-file-aio \
    --with-threads \
    --with-stream \
    --with-http_mp4_module \
    --with-http_slice_module \
    --with-cc-opt="-I/usr/include/ffmpeg" \
    --with-ld-opt="-lavcodec -lavformat -lavutil" \
    --with-http_sub_module \
    --add-module=/modules/nginx-vod-module-1.33 \
    --add-module=/modules/nginx-aws-auth-module-1.1 \
    --add-module=/modules/nginx-secure-token-module-1.5 \
    && make -j$(nproc) \
    && make install

# Configurar permisos y directorios
RUN mkdir -p /var/cache/nginx /var/log/nginx && \
    chown -R www-data:www-data /var/cache/nginx /var/log/nginx && \
    ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

# Copiar script entrypoint.sh
COPY entrypoint.sh /entrypoint.sh

# Argumento para especificar el archivo de plantilla
ARG TEMPLATE_FILE="nginx.conf.template"
COPY ${TEMPLATE_FILE} /etc/nginx/nginx.conf.template

# Limpiar archivos temporales
RUN rm -rf /nginx-${NGINX_VERSION} /modules/*.tar.gz

# Asegurarse de que el script sea ejecutable
RUN chmod +x /entrypoint.sh

# Definir el punto de entrada
ENTRYPOINT ["/entrypoint.sh"]
