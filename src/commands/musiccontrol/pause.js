module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const queue = client.player.nodes.get(interaction.guild);

        if (!queue) {
            await interaction.editReply('There is no song playing.');
            return;
        }

        queue.node.pause();

        await interaction.editReply('The current song has been paused.')
    },

    name: 'pause',
    description: 'Pause the current song.',
    devOnly: true,
};