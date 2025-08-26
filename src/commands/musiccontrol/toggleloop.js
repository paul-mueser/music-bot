const editQueueDashboard = require("../../utils/editQueueDashboard");
const {QueueRepeatMode, useQueue} = require("discord-player");

module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild);

        if (!queue || !queue.isPlaying()) {
            return interaction.editReply({content: 'There is no song playing.', ephemeral: true});
        }

        if (queue.repeatMode === QueueRepeatMode.TRACK) {
            queue.setRepeatMode(QueueRepeatMode.OFF);
            await interaction.editReply('Looping has been disabled.')
        } else {
            queue.setRepeatMode(QueueRepeatMode.TRACK);
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