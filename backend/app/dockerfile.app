FROM node

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y ffmpeg

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000
CMD ["node", "index.js"]