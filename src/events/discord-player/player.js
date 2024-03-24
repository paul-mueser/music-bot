const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { button } = require('../../utils/constants');

const registerPlayerEvents = (player, client) => {
    player.events.on('connection', async (queue) => {
        const playPauseButton = new ButtonBuilder().setCustomId('Playing-PlayPause').setEmoji(button.pause).setStyle(ButtonStyle.Secondary);
        const skipButton = new ButtonBuilder().setCustomId('Playing-Skip').setEmoji(button.skip).setStyle(ButtonStyle.Secondary);
        const stopButton = new ButtonBuilder().setCustomId('Playing-Stop').setEmoji(button.stop).setStyle(ButtonStyle.Danger);
        // const loopButton = new ButtonBuilder().setCustomId('Playing-Loop').setEmoji(button.loop).setStyle(ButtonStyle.Secondary);
        const shuffleButton = new ButtonBuilder().setCustomId('Playing-Shuffle').setEmoji(button.shuffle).setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder().addComponents(playPauseButton, skipButton, stopButton, shuffleButton);

        const startEmbed = new EmbedBuilder().setTitle('Dashboard').setDescription('No music is currently playing.');

        queue.dashboard = await queue.metadata.channel.send({ embeds: [startEmbed], components: [row] });
        return;
    });

    player.events.on('playerStart', async (queue, track) => {
        let playing = queue.node.isPaused();

        const playPauseButton = new ButtonBuilder().setCustomId('Playing-PlayPause').setEmoji(playing ? button.play : button.pause).setStyle(ButtonStyle.Secondary);
        const skipButton = new ButtonBuilder().setCustomId('Playing-Skip').setEmoji(button.skip).setStyle(ButtonStyle.Secondary);
        const stopButton = new ButtonBuilder().setCustomId('Playing-Stop').setEmoji(button.stop).setStyle(ButtonStyle.Danger);
        // const loopButton = new ButtonBuilder().setCustomId('Playing-Loop').setEmoji(button.loop).setStyle(ButtonStyle.Secondary);
        const shuffleButton = new ButtonBuilder().setCustomId('Playing-Shuffle').setEmoji(button.shuffle).setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder().addComponents(playPauseButton, skipButton, stopButton, shuffleButton);

        const dashboardEmbed = new EmbedBuilder()
            .setTitle('Dashboard')
            .setDescription(`[${track.title}](${track.url}) is now playing.`)
            .setThumbnail(track.thumbnail)
            .setTimestamp();

        return await queue.dashboard.edit({ embeds: [dashboardEmbed], components: [row] });
    });

    player.events.on('disconnect', (queue) => {
        if (queue.dashboard) {
            queue.dashboard.delete();
        }

        if (queue.queueContent && queue.queueContent.message) {
            queue.queueContent.message.delete();
        }
    });
}

module.exports = registerPlayerEvents;