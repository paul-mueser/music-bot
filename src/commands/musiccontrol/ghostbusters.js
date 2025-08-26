const oneSongLoopHandler = require('../../handlers/oneSongLoopHandler');

module.exports = {

    callback: async (client, interaction) => {
        const songLink = 'https://www.youtube.com/watch?v=TaV1r341wYk';
        const replyText = 'Who you gonna call? 🚫👻🚫';
        await oneSongLoopHandler(client, interaction, songLink, replyText)
    },

    name: 'ghostbusters',
    description: 'Plays the ghostbusters theme song on repeat.',
};