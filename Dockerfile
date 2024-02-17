FROM node:20
RUN sudo apt update
RUN sudo apt install ffmpeg
ENV TZ="Europe/Berlin"
WORKDIR /usr/src/stats-bot
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "src/index.js"]