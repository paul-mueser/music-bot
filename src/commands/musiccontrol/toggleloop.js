const {ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const {button} = require("../../utils/constants");
module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const queue = client.player.nodes.get(interaction.guild);

        if (!queue || !queue.isPlaying()) {
            return interaction.editReply({content: 'There is no song playing.', ephemeral: true});
        }

        const loop = queue.repeatMode === 1;

        if (loop) {
            queue.setRepeatMode(0);
            await interaction.editReply('Looping has been disabled.')
        } else {
            queue.setRepeatMode(1);
            await interaction.editReply('The current song will be looped.')

        }

        if (queue.dashboard) {
            let playing = queue.node.isPaused();

            const playPauseButton = new ButtonBuilder().setCustomId('Playing-PlayPause').setEmoji(playing ? button.play : button.pause).setStyle(playing ? ButtonStyle.Success : ButtonStyle.Secondary);
            const skipButton = new ButtonBuilder().setCustomId('Playing-Skip').setEmoji(button.skip).setStyle(ButtonStyle.Secondary);
            const stopButton = new ButtonBuilder().setCustomId('Playing-Stop').setEmoji(button.stop).setStyle(ButtonStyle.Danger);
            const loopButton = new ButtonBuilder().setCustomId('Playing-Loop').setEmoji(button.loop).setStyle(!loop ? ButtonStyle.Danger : ButtonStyle.Secondary);
            const shuffleButton = new ButtonBuilder().setCustomId('Playing-Shuffle').setEmoji(button.shuffle).setStyle(ButtonStyle.Secondary);
            const row = new ActionRowBuilder().addComponents(playPauseButton, skipButton, stopButton, loopButton, shuffleButton);

            queue.dashboard.edit({ components: [row] });
        }
    },

    name: 'toggleloop',
    description: 'Toggle looping of the current song.',
};