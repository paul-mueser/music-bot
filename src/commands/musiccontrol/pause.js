const editQueueDashboard = require("../../utils/editQueueDashboard");

module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const queue = client.player.nodes.get(interaction.guild);

        if (!queue) {
            return interaction.editReply({content: 'There is no song playing.', ephemeral: true});
        }

        queue.node.pause();

        await interaction.editReply('The current song has been paused.')

        if (queue.dashboard) {
            const row = editQueueDashboard(queue);
            queue.dashboard.edit({ components: [row] });
        }
    },

    name: 'pause',
    description: 'Pause the current song.',
};