const editQueueDashboard = require("../../utils/editQueueDashboard");

module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const queue = client.player.nodes.get(interaction.guild);

        if (!queue || !queue.isPlaying()) {
            return interaction.editReply({content: 'There is no song playing.', ephemeral: true});
        }

        if (queue.repeatMode === 1) {
            queue.setRepeatMode(0);
            await interaction.editReply('Looping has been disabled.')
        } else {
            queue.setRepeatMode(1);
            await interaction.editReply('The current song will be looped.')

        }

        if (queue.dashboard) {
            const row = editQueueDashboard(queue);
            queue.dashboard.edit({components: [row]});
        }
    },

    name: 'toggleloop',
    description: 'Toggle looping of the current song.',
};