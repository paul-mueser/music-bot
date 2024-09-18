require('dotenv').config();

const {Client, GatewayIntentBits} = require('discord.js');
const {Player} = require('discord-player');
const {BridgeProvider, BridgeSource} = require('@discord-player/extractor');
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

const bridgeProvider = new BridgeProvider(BridgeSource.SoundCloud);

client.player = new Player(client, {
    // bridgeProvider for soundcloud, only works with soundcloud premium account (not free)
    // bridgeProvider,
    ytdlOptions: {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

client.player.extractors.register(YoutubeiExtractor, {});

registerPlayerEvents(client.player);

eventHandler(client);

client.login(process.env.TOKEN);