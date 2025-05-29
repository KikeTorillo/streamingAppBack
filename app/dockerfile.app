# Etapa 1: build
FROM node AS builder

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos solo package.json y package-lock.json para cachear dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm ci

# Copiamos el resto del código
COPY . .

# Etapa 2: runtime
FROM node

WORKDIR /usr/src/app

# Copiamos node_modules y el código compilado desde la etapa "builder"
COPY --from=builder /usr/src/app ./

# Exponemos el puerto en el que corre tu API
EXPOSE 3000

# Comando por defecto
CMD ["node", "index.js"]