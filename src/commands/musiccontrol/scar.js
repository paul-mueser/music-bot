const oneSongLoopHandler = require('../../handlers/oneSongLoopHandler')
const {wait} = require("../../utils/wait");

module.exports = {

    callback: async (client, interaction) => {
        const songLink = 'https://www.youtube.com/watch?v=0N2TmZVBLwM';
        const replyText = 'Warum liebt mich niemand? 🦁';
        await oneSongLoopHandler(client, interaction, songLink, replyText);

        await wait(500);
        const queue = client.player.nodes.get(interaction.guild);
        queue.setRepeatMode(0);
    },

    name: 'scar',
    description: 'Plays the scar song on repeat.',
};