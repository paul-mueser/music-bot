const editQueueDashboard = require("../../utils/editQueueDashboard");
const {useQueue, useTimeline} = require('discord-player');

module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();
        
        const timeline = useTimeline({node: interaction.guild});
        const queue = useQueue(interaction.guild);
        
        if (!timeline || timeline.paused) {
            return interaction.editReply({content: 'There is no song playing.', ephemeral: true});
        }

        timeline.pause();

        await interaction.editReply('The current song has been paused.')

        if (queue.dashboard) {
            const row = editQueueDashboard(queue);
            queue.dashboard.edit({components: [row]});
        }
    },

    name: 'pause',
    description: 'Pause the current song.',
};