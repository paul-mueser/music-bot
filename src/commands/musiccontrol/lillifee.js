const oneSongLoopHandler = require('../../handlers/oneSongLoopHandler');

module.exports = {

    callback: async (client, interaction) => {
        const songLink = 'https://www.youtube.com/watch?v=jgw0SAj9UXg';
        const replyText = 'Tanz, tanz, den Lillifee Dance. 🧚👑️';
        await oneSongLoopHandler(client, interaction, songLink, replyText)
    },

    name: 'lillifee',
    description: 'Plays the lillifee dance.',
};