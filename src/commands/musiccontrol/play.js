const {ApplicationCommandOptionType} = require('discord.js');
const {QueryType} = require('discord-player')

module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        await client.player.extractors.loadDefault();

        if (!interaction.member.voice.channel) {
            await interaction.editReply({
                content: 'You must be in a voice channel to use this command!',
                ephemeral: true
            });
            return;
        }

        const musicLink = interaction.options.get('music-link').value;

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

        const result = await client.player.search(musicLink, {
            requestedBy: interaction.usage,
            searchEngine: QueryType.AUTO,
        });

        if (!result.hasTracks() || result.isEmpty()) {
            await interaction.editReply({content: 'No results found!', ephemeral: true});
            return;
        }

        result.hasPlaylist() ? queue.addTrack(result.tracks) : queue.addTrack(result.tracks[0]);

        if (!queue.node.isPlaying()) await queue.node.play();

        if (result.hasPlaylist()) {
            await interaction.editReply(`Successfully added \`${result.tracks.length}\` tracks to the queue.`);
        } else {
            await interaction.editReply(`Successfully added \`${result.tracks[0].title}\` by \`${result.tracks[0].author}\` to the queue.`);
        }
    },

    name: 'play',
    description: 'Plays a song.',
    options: [
        {
            name: 'music-link',
            description: 'The song you want to play.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
};