module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const queue = client.player.nodes.get(interaction.guild);

        if (!queue) {
            await interaction.editReply('There is no song playing.');
            return;
        }

        queue.node.resume();

        await interaction.editReply('Resume playing.')
    },

    name: 'resume',
    description: 'Resume the current song.',
    devOnly: true,
};