const {useQueue} = require("discord-player");

module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild);

        if (!queue || !queue.isPlaying()) {
            return interaction.editReply({content: 'There is no song playing.', ephemeral: true});
        }

        const currentSong = queue.currentTrack;

        queue.node.skip();

        await interaction.editReply(`Skipped **${currentSong.title}**`)
    },

    name: 'skip',
    description: 'Skip the current song.',
};