const oneSongLoopHandler = require('../../handlers/oneSongLoopHandler')
const {wait} = require("../../utils/wait");
const editQueueDashboard = require("../../utils/editQueueDashboard");

module.exports = {

    callback: async (client, interaction) => {
        const songList = [
            'https://www.youtube.com/watch?v=TaV1r341wYk',
            'https://www.youtube.com/watch?v=hLeUL4i9PNw',
            'https://www.youtube.com/watch?v=jgw0SAj9UXg',
            'https://www.youtube.com/watch?v=JY0UKypROAw',
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'https://www.youtube.com/watch?v=0-wVealwtsg',
            'https://www.youtube.com/watch?v=4G6QDNC4jPs',
            'https://www.youtube.com/watch?v=TOb2NXx_GQo',
            'https://www.youtube.com/watch?v=uiYQ3SPIkLQ',
        ]

        const songLink = songList[Math.floor(Math.random() * songList.length)];
        const replyText = 'Surprise! 🎉🎉🎉';
        await oneSongLoopHandler(client, interaction, songLink, replyText)

        await wait(500);
        const queue = client.player.nodes.get(interaction.guild);
        queue.setRepeatMode(0);

        if (queue.dashboard) {
            const row = editQueueDashboard(queue);

            queue.dashboard.edit({ components: [row] });
        }
    },

    name: 'surprise',
    description: 'Surprises you.',
};