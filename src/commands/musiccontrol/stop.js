const {useQueue} = require("discord-player");

module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild);

        if (!queue) {
            return interaction.editReply({content: 'There is no song playing.', ephemeral: true});
        }

        if (!queue.deleted) {
            queue.delete();
        }

        if (queue.dashboard) {
            queue.dashboard.delete();
        }

        if (queue.queueContent && queue.queueContent.message) {
            queue.queueContent.message.delete();
        }

        await interaction.editReply('Bye, Bye!')
    },

    name: 'stop',
    description: 'Stops playing music.',
};