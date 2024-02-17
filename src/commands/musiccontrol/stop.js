module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const queue = client.player.nodes.get(interaction.guild);

        if (!queue) {
            await interaction.editReply('There is no song playing.');
            return;
        }

        if (!queue.deleted) {
            queue.delete();
        }

        await interaction.editReply('Bye, Bye!')
    },

    name: 'stop',
    description: 'Stops playing music.',
    devOnly: true,
};