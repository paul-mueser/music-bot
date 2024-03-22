const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        if (!interaction.member.voice.channel) {
            await interaction.editReply("You must be in a voice channel to use this command!");
            return;
        }

        const queue = client.player.nodes.get(interaction.guildId);

        if (!queue || !queue.currentTrack) {
            return interaction.editReply('❌ | There is no music playing!');
        }

        const tracks = queue.tracks.map((track, i) => `**${i + 1}**. [${track.title}](${track.url}) - \`${track.duration}\``);

        if (tracks.length === 0) {
            return interaction.editReply('❌ | There are no songs in the queue!');
        }

        if (tracks.length > 10) {
            const length = tracks.length;
            tracks.length = 10;
            tracks.push(`And **${length - 10}** more...`);
        }

        const queueEmbed = new EmbedBuilder()
            .setTitle('Queue')
            .setDescription(tracks.join('\n'));

        await interaction.editReply({embeds: [queueEmbed]});
    },

    name: 'queue',
    description: 'List the queued songs.',
    devonly: true,
};