const oneSongLoopHandler = require('../../handlers/oneSongLoopHandler')
const {wait} = require("../../utils/wait");
const {QueueRepeatMode, useQueue} = require("discord-player");

module.exports = {

    callback: async (client, interaction) => {
        const songLink = 'https://www.youtube.com/watch?v=0N2TmZVBLwM';
        const replyText = 'Warum liebt mich niemand? 🦁';
        await oneSongLoopHandler(client, interaction, songLink, replyText);

        await wait(500);
        const queue = useQueue(interaction.guild);
        queue.setRepeatMode(QueueRepeatMode.OFF);
    },

    name: 'scar',
    description: 'Plays the scar song on repeat.',
};