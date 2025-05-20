# Usa la imagen oficial de Node.js basada en Debian
FROM node:22

# Directorio de trabajo
WORKDIR /usr/src/app

# Copia package.json y package-lock.json (si existe) e instala dependencias
COPY package*.json ./
RUN npm install --production

# Copia el código de la aplicación
COPY . .

# Expone el puerto que utiliza la app
EXPOSE 3000

# Comando de arranque
CMD ["node", "index.js"]