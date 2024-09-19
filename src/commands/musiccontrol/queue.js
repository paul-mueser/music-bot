const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const {button} = require("../../utils/constants");

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

        if (!queue.queueContent) {
            queue.queueContent = {};
        }

        queue.queueContent.messageTracks = queue.tracks.map((track, i) => `**${i + 1}**. [${track.title}](${track.url}) - \`${track.duration}\``);

        if (queue.queueContent.message) {
            await queue.queueContent.message.delete();
        }

        const queueEmbed = new EmbedBuilder()
            .setTitle('Queue')
            .setDescription(tracks.join('\n'));

        await interaction.editReply('Here is the queue:');

        if (queue.queueContent.messageTracks.length > 10) {
            const forwardButton = new ButtonBuilder().setCustomId('Queue-Forward').setEmoji(button.skip).setStyle(ButtonStyle.Secondary);
            const row = new ActionRowBuilder().addComponents(forwardButton);

            queue.queueContent.message = await queue.metadata.channel.send({embeds: [queueEmbed], components: [row]});
        } else {
            queue.queueContent.message = await queue.metadata.channel.send({embeds: [queueEmbed]});
        }
        queue.queueContent.page = 0;
    },

    name: 'queue',
    description: 'List the queued songs.',
    devonly: true,
};