const oneSongLoopHandler = require('../../handlers/oneSongLoopHandler')

module.exports = {

    callback: async (client, interaction) => {
        const songLink = 'https://www.youtube.com/watch?v=hLeUL4i9PNw';
        const replyText = 'Aserejé, ja de je de jebe tu de jebere sebiunouva\n' +
            'majavi an a bugui an a buididipí 🍅🔨';
        await oneSongLoopHandler(client, interaction, songLink, replyText)
    },

    name: 'ketchup',
    description: 'Plays the ketchup song.',
};