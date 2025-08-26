const {useMainPlayer, useQueue, QueueRepeatMode} = require("discord-player");
const {wait} = require("../utils/wait");
const editQueueDashboard = require("../utils/editQueueDashboard");

module.exports = async (client, interaction, songLink, replyText) => {

    await interaction.deferReply();

    const player = useMainPlayer();

    if (!interaction.member.voice.channel) {
        await interaction.editReply({content: 'You must be in a voice channel to use this command!', ephemeral: true});
        return;
    }

    let queue = useQueue(interaction.guild);

    const result = await player.search(songLink, {
        requestedBy: interaction.user
    });

    if (!result.hasTracks() || result.isEmpty()) {
        await interaction.editReply({content: 'No results found!', ephemeral: true});
        return;
    }

    if (!queue || !queue.isPlaying()) {
        await player.play(interaction.member.voice.channel, songLink, {
            nodeOptions: {
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
                connectionTimeout: 999_999_999
            },
        });
        queue = await useQueue(interaction.guild);
    } else {
        await queue.insertTrack(result.tracks[0], 0);
        queue.setRepeatMode(QueueRepeatMode.OFF);
        queue.node.skip();
    }

    await wait(500);
    queue.setRepeatMode(QueueRepeatMode.TRACK);

    await interaction.editReply(replyText);

    if (queue.dashboard) {
        const row = editQueueDashboard(queue);

        queue.dashboard.edit({components: [row]});
    }
};