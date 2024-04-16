const oneSongLoopHandler = require('../../handlers/oneSongLoopHandler')

module.exports = {

    callback: async (client, interaction) => {
        const songLink = 'https://www.youtube.com/watch?v=JY0UKypROAw';
        const replyText = 'Who\'s that wonderful girl? 🪄🌸\nCould she be any cuter?';
        await oneSongLoopHandler(client, interaction, songLink, replyText)
    },

    name: 'whosthatwonderfulgirl',
    description: 'Plays who\'s that wonderful girl.',
};