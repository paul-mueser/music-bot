module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const queue = client.player.nodes.get(interaction.guild);

        if (!queue) {
            return interaction.editReply({content: 'There is no song in the queue to play.', ephemeral: true});
        }

        queue.node.resume();

        await interaction.editReply('Resume playing.')
    },

    name: 'resume',
    description: 'Resume the current song.',
};