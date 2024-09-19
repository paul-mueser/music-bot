const {QueryType} = require("discord-player");
const {wait} = require("../utils/wait");
const editQueueDashboard = require("../utils/editQueueDashboard");

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

    if (!queue.node.isPlaying()) {
        await queue.node.play();
    } else {
        queue.setRepeatMode(0);
        queue.node.skip();
    }

    await wait(500);
    queue.setRepeatMode(1);

    await interaction.editReply(replyText);

    if (queue.dashboard) {
        const row = editQueueDashboard(queue);

        queue.dashboard.edit({components: [row]});
    }
};