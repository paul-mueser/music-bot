const editQueueDashboard = require("../../utils/editQueueDashboard");
const {useTimeline, useQueue} = require("discord-player");

module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const timeline = useTimeline({node: interaction.guild});
        const queue = useQueue(interaction.guild);
        
        if (!timeline || !timeline.paused) {
            return interaction.editReply({content: 'There is no song paused.', ephemeral: true});
        }
        
        timeline.resume();

        await interaction.editReply('Resume playing.')

        if (queue.dashboard) {
            const row = editQueueDashboard(queue);
            queue.dashboard.edit({components: [row]});
        }
    },

    name: 'resume',
    description: 'Resume the current song.',
};