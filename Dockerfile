FROM node:20
ENV TZ="Europe/Berlin"
WORKDIR /usr/src/music-bot
COPY package*.json ./
RUN npm install
RUN apt update
RUN apt install ffmpeg -y
COPY . .
CMD ["node", "src/index.js"]
