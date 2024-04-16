const {QueryType} = require("discord-player");
const {wait} = require("../utils/wait");
const {ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const {button} = require("../utils/constants");
module.exports = async (client, interaction, songLink, replyText) => {

    await interaction.deferReply();

    await client.player.extractors.loadDefault();

    if (!interaction.member.voice.channel) {
        await interaction.editReply({content: 'You must be in a voice channel to use this command!', ephemeral: true});
        return;
    }

    const queue = await client.player.nodes.create(interaction.guild, {
        metadata: {
            channel: interaction.channel,
            client: interaction.guild.members.me,
            requestedBy: interaction.user
        },
        volume: 20,
        selfDeaf: true,
        leaveOnEmpty: true,
        leaveOnEnd: true,
        leaveOnEmptyCooldown: 5000,
        leaveOnEndCooldown: 5000,
        skipOnNoStream: true,
        connectionTimeout: 999_999_999
    });

    if (!queue.connection) await queue.connect(interaction.member.voice.channel);

    const result = await client.player.search(songLink, {
        requestedBy: interaction.usage,
        searchEngine: QueryType.AUTO,
    });

    if (!result.hasTracks() || result.isEmpty()) {
        await interaction.editReply({content: 'No results found!', ephemeral: true});
        return;
    }

    await queue.insertTrack(result.tracks[0], 0);

    if(!queue.node.isPlaying()) {
        await queue.node.play();
    } else {
        queue.setRepeatMode(0);
        queue.node.skip();
    }

    await wait(500);
    queue.setRepeatMode(1);

    await interaction.editReply(replyText);

    if (queue.dashboard) {
        const playing = queue.node.isPaused();

        const playPauseButton = new ButtonBuilder().setCustomId('Playing-PlayPause').setEmoji(playing ? button.play : button.pause).setStyle(playing ? ButtonStyle.Success : ButtonStyle.Secondary);
        const skipButton = new ButtonBuilder().setCustomId('Playing-Skip').setEmoji(button.skip).setStyle(ButtonStyle.Secondary);
        const stopButton = new ButtonBuilder().setCustomId('Playing-Stop').setEmoji(button.stop).setStyle(ButtonStyle.Danger);
        const loopButton = new ButtonBuilder().setCustomId('Playing-Loop').setEmoji(button.loop).setStyle(ButtonStyle.Danger);
        const shuffleButton = new ButtonBuilder().setCustomId('Playing-Shuffle').setEmoji(button.shuffle).setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder().addComponents(playPauseButton, skipButton, stopButton, loopButton, shuffleButton);

        queue.dashboard.edit({ components: [row] });
    }
};