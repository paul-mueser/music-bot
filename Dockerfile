FROM node:20
RUN apt update
RUN apt install ffmpeg -y
ENV TZ="Europe/Berlin"
WORKDIR /usr/src/stats-bot
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "src/index.js"]