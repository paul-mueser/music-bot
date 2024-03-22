module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const queue = client.player.nodes.get(interaction.guild);

        if (!queue) {
            return interaction.editReply({content: 'There is no song playing.', ephemeral: true});
        }

        queue.node.pause();

        await interaction.editReply('The current song has been paused.')
    },

    name: 'pause',
    description: 'Pause the current song.',
};