# 🏠 BACKEND NODE.JS - OPTIMIZADO PARA PRODUCCIÓN
FROM node:20-alpine AS base

# Variables de entorno
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_FUND=false
ENV NPM_CONFIG_AUDIT=false

# Instalar dependencias del sistema (incluyendo ffmpeg)
RUN apk add --no-cache \
    ffmpeg \
    curl \
    git \
    && rm -rf /var/cache/apk/*

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# ==========================================
# 📦 STAGE: Dependencias
# ==========================================
FROM base AS dependencies

WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && \
    npm cache clean --force

# ==========================================
# 🏗️ STAGE: Aplicación
# ==========================================
FROM base AS application

WORKDIR /usr/src/app

# Copiar dependencias desde el stage anterior
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Cambiar propietario a usuario no-root
RUN chown -R nodejs:nodejs /usr/src/app

# Cambiar a usuario no-root
USER nodejs

# Crear directorios necesarios con permisos correctos
RUN mkdir -p tempProcessinDir temp_downloads uploads

# Healthcheck para verificar que la aplicación funciona
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Exponer puerto
EXPOSE 3000

# Comando para producción
CMD ["node", "index.js"]