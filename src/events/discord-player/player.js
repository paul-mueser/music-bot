const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { button } = require('../../utils/constants');
const editQueueDashboard = require("../../utils/editQueueDashboard");

const registerPlayerEvents = (player) => {
    player.events.on('connection', async (queue) => {
        const playPauseButton = new ButtonBuilder().setCustomId('Playing-PlayPause').setEmoji(button.pause).setStyle(ButtonStyle.Secondary);
        const skipButton = new ButtonBuilder().setCustomId('Playing-Skip').setEmoji(button.skip).setStyle(ButtonStyle.Secondary);
        const stopButton = new ButtonBuilder().setCustomId('Playing-Stop').setEmoji(button.stop).setStyle(ButtonStyle.Danger);
        const loopButton = new ButtonBuilder().setCustomId('Playing-Loop').setEmoji(button.loop).setStyle(ButtonStyle.Secondary);
        const shuffleButton = new ButtonBuilder().setCustomId('Playing-Shuffle').setEmoji(button.shuffle).setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder().addComponents(playPauseButton, skipButton, stopButton, loopButton, shuffleButton);

        const startEmbed = new EmbedBuilder().setTitle('Dashboard').setDescription('No music is currently playing.');

        queue.dashboard = await queue.metadata.channel.send({ embeds: [startEmbed], components: [row] });
    });

    player.events.on('playerStart', async (queue, track) => {
        const row = editQueueDashboard(queue);

        const dashboardEmbed = new EmbedBuilder()
            .setTitle('Dashboard')
            .setDescription(`[${track.title}](${track.url}) is now playing.`)
            .setThumbnail(track.thumbnail)
            .setTimestamp();

        return await queue.dashboard.edit({ embeds: [dashboardEmbed], components: [row] });
    });

    player.events.on('disconnect', (queue) => {
        if (queue.dashboard) {
            queue.dashboard.reply('Bye, Bye!');
            queue.dashboard.delete();
        }

        if (queue.queueContent && queue.queueContent.message) {
            queue.queueContent.message.delete();
        }
    });
}

module.exports = registerPlayerEvents;