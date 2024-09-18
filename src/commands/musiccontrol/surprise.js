const oneSongLoopHandler = require('../../handlers/oneSongLoopHandler')
const {wait} = require("../../utils/wait");
const editQueueDashboard = require("../../utils/editQueueDashboard");
const {QueryType} = require("discord-player");
const {ApplicationCommandOptionType} = require('discord.js');

module.exports = {

    callback: async (client, interaction) => {
        const count = interaction.options.get('count')?.value || 0;

        const songList = [
            'https://www.youtube.com/watch?v=TaV1r341wYk', // Ghostbusters Theme Song
            'https://www.youtube.com/watch?v=hLeUL4i9PNw', // The Ketchup Song
            'https://www.youtube.com/watch?v=jgw0SAj9UXg', // Lillifee Dance
            'https://www.youtube.com/watch?v=JY0UKypROAw', // Who's that wonderful girl
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up
            'https://www.youtube.com/watch?v=0-wVealwtsg', // Ich nehm dich bei der Hand
            'https://www.youtube.com/watch?v=4G6QDNC4jPs', // Cascada - Everytime We Touch
            'https://www.youtube.com/watch?v=TOb2NXx_GQo', // Mädchen auf dem Pferd
            'https://www.youtube.com/watch?v=uiYQ3SPIkLQ', // Kreisligalegende - Mannschaft
            'https://www.youtube.com/watch?v=hVVxPzinj9Y', // Metronomi schmomi
        ]

        const songLink = songList[Math.floor(Math.random() * songList.length)];
        const replyText = 'Surprise! 🎉🎉🎉';
        await oneSongLoopHandler(client, interaction, songLink, replyText)

        await wait(500);
        const queue = client.player.nodes.get(interaction.guild);
        queue.setRepeatMode(0);

        for (let i = 1; i < count; i++) {
            const songLink = songList[Math.floor(Math.random() * songList.length)];
            const result = await client.player.search(songLink, {
                requestedBy: interaction.usage,
                searchEngine: QueryType.AUTO,
            });

            if (!result.hasTracks() || result.isEmpty()) {
                await interaction.editReply({content: 'No results found!', ephemeral: true});
                return;
            }

            await queue.insertTrack(result.tracks[0], 0);
        }

        if (queue.dashboard) {
            const row = editQueueDashboard(queue);

            queue.dashboard.edit({ components: [row] });
        }
    },

    name: 'surprise',
    description: 'Surprises you.',
    options: [
        {
            name: 'count',
            description: 'How many times do you want to be surprised?',
            type: ApplicationCommandOptionType.Integer,
            required: false,
        },
    ],
};