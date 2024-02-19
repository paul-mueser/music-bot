const {ApplicationCommandOptionType, EmbedBuilder} = require('discord.js');
const {QueryType} = require('discord-player')

module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        await client.player.extractors.loadDefault();

        if (!interaction.member.voice.channel) {
            await interaction.editReply("You must be in a voice channel to use this command!");
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
            skipOnNoStream: true,
            connectionTimeout: 999_999_999
        });

        if (!queue.connection) await queue.connect(interaction.member.voice.channel);

        const result = await client.player.search(musicLink, {
            requestedBy: interaction.usage,
            searchEngine: QueryType.AUTO, // todo change query type based on input (musicLink)
        });

        if (!result.hasTracks() || result.isEmpty()) {
            await interaction.editReply("No results found!");
            return;
        }

        result.hasPlaylist() ? queue.addTrack(result.tracks) : queue.addTrack(result.tracks[0]);

        let embed = new EmbedBuilder()
            .setDescription(`Added **[${result.tracks[0].title}](${result.tracks[0].url})** to the queue.`)
            .setThumbnail(result.tracks[0].thumbnail)
            .setFooter({text: `Duration: ${result.tracks[0].duration}`}); // todo update embed for playlist support

        if(!queue.node.isPlaying()) await queue.node.play();

        await interaction.editReply({
            embeds: [embed]
        });
    },

    name: 'play',
    description: 'Plays a song.',
    devOnly: true,
    options: [
        {
            name: 'music-link',
            description: 'The song you want to play.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
};