const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { wait } = require('../../utils/wait');
const { button } = require('../../utils/constants');

module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;

    if (!interaction.member.voice.channel) {
        return interaction.reply({content: "You must be in the same voice channel as me!", ephemeral: true});
    }

    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
        return interaction.reply({content: "You must be in the same voice channel as me!", ephemeral: true});
    }

    const queue = client.player.nodes.get(interaction.guildId);

    if (!queue || !queue.isPlaying()) {
        return interaction.reply({content: `There is currently no music playing.`, ephemeral: true});
    }


    switch (interaction.customId) {
        case 'Playing-PlayPause': {
            let playing = !queue.node.isPaused();

            if (playing) {
                queue.node.pause();
            } else {
                queue.node.resume();
            }

            const playPauseButton = new ButtonBuilder().setCustomId('Playing-PlayPause').setEmoji(playing ? button.play : button.pause).setStyle(playing ? ButtonStyle.Success : ButtonStyle.Secondary);
            const skipButton = new ButtonBuilder().setCustomId('Playing-Skip').setEmoji(button.skip).setStyle(ButtonStyle.Secondary);
            const stopButton = new ButtonBuilder().setCustomId('Playing-Stop').setEmoji(button.stop).setStyle(ButtonStyle.Danger);
            // const loopButton = new ButtonBuilder().setCustomId('Playing-Loop').setEmoji(button.loop).setStyle(ButtonStyle.Secondary);
            const shuffleButton = new ButtonBuilder().setCustomId('Playing-Shuffle').setEmoji(button.shuffle).setStyle(ButtonStyle.Secondary);
            const row = new ActionRowBuilder().addComponents(playPauseButton, skipButton, stopButton, shuffleButton);

            await interaction.update({ components: [row] });
        } break;
        case 'Playing-Skip': {
            if (queue.repeatMode === 1) {
                queue.setRepeatMode(0);
                queue.node.skip();
                await wait(500);
                queue.setRepeatMode(1);
            } else {
                queue.node.skip();
                await wait(500);
            }

            let playing = !queue.node.isPaused();

            const playPauseButton = new ButtonBuilder().setCustomId('Playing-PlayPause').setEmoji(playing ? button.play : button.pause).setStyle(playing ? ButtonStyle.Success : ButtonStyle.Secondary);
            const skipButton = new ButtonBuilder().setCustomId('Playing-Skip').setEmoji(button.skip).setStyle(ButtonStyle.Secondary);
            const stopButton = new ButtonBuilder().setCustomId('Playing-Stop').setEmoji(button.stop).setStyle(ButtonStyle.Danger);
            // const loopButton = new ButtonBuilder().setCustomId('Playing-Loop').setEmoji(button.loop).setStyle(ButtonStyle.Secondary);
            const shuffleButton = new ButtonBuilder().setCustomId('Playing-Shuffle').setEmoji(button.shuffle).setStyle(ButtonStyle.Secondary);
            const row = new ActionRowBuilder().addComponents(playPauseButton, skipButton, stopButton, shuffleButton);

            await interaction.update({ components: [row] });
        } break;
        case 'Playing-Stop': {
            if (!queue.deleted) {
                queue.delete();
            }

            if (queue.dashboard) {
                queue.dashboard.delete();
            }

            await interaction.reply('Bye, Bye!');
        } break;
        case 'Playing-Shuffle': {
            queue.tracks.shuffle();
            await interaction.reply('I\'ve mixed things up a bit in the queue.');
        } break;
    }
};