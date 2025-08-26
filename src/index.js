require('dotenv').config();

const {Client, GatewayIntentBits} = require('discord.js');
const {Player} = require('discord-player');
const {SpotifyExtractor, AppleMusicExtractor} = require('@discord-player/extractor');
const {YoutubeiExtractor} = require("discord-player-youtubei")

const registerPlayerEvents = require('./events/discord-player/player');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

const player = new Player(client, {
    ytdlOptions: {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

player.extractors.loadMulti([SpotifyExtractor, AppleMusicExtractor]);
player.extractors.register(YoutubeiExtractor, {});

registerPlayerEvents(player);

eventHandler(client);

client.login(process.env.TOKEN);