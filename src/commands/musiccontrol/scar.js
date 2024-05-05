const oneSongLoopHandler = require('../../handlers/oneSongLoopHandler')

module.exports = {

    callback: async (client, interaction) => {
        const songLink = 'https://www.youtube.com/watch?v=0N2TmZVBLwM';
        const replyText = 'Warum liebt mich niemand? 🦁';
        await oneSongLoopHandler(client, interaction, songLink, replyText)
    },

    name: 'scar',
    description: 'Plays the scar song on repeat.',
};