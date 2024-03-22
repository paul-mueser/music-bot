module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const queue = client.player.nodes.get(interaction.guild);

        if (!queue) {
            return interaction.editReply({content: 'There is no song playing.', ephemeral: true});
        }

        const currentSong = queue.currentTrack;

        queue.node.skip();

        await interaction.editReply(`Skipped **${currentSong.title}**`)
    },

    name: 'skip',
    description: 'Skip the current song.',
};