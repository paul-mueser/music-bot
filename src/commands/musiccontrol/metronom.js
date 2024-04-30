const oneSongLoopHandler = require('../../handlers/oneSongLoopHandler')

module.exports = {

    callback: async (client, interaction) => {
        const songLink = 'https://www.youtube.com/watch?v=hVVxPzinj9Y';
        const replyText = 'Metronomi schmomi! 🚈';
        await oneSongLoopHandler(client, interaction, songLink, replyText)
    },

    name: 'metronom',
    description: 'Plays the metronom song on repeat.',
};