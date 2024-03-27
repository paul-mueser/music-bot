module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const queue = client.player.nodes.get(interaction.guild);

        if (!queue) {
            return interaction.editReply({content: 'There is no song playing.', ephemeral: true});
        }

        queue.tracks.shuffle();

        await interaction.editReply('I\'ve mixed things up a bit in the queue.');
    },

    name: 'shuffle',
    description: 'Shuffles the queue.',
};