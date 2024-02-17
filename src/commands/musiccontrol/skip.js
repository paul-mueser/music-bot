const {EmbedBuilder} = require('discord.js');

module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const queue = client.player.nodes.get(interaction.guild);

        if (!queue) {
            await interaction.editReply('There is no song playing.');
            return;
        }

        const currentSong = queue.currentTrack;

        queue.node.skip();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Skipped **${currentSong.title}**`)
            ]
        })
    },

    name: 'skip',
    description: 'Skip the current song.',
    devOnly: true,
};