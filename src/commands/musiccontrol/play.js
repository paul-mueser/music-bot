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

        const queue = await client.player.nodes.create(interaction.guild);

        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        ;
        const result = await client.player.search(musicLink, {
            requestedBy: interaction.usage,
            searchEngine: QueryType.YOUTUBE_VIDEO,
        });

        if (result.tracks.length === 0) {
            await interaction.editReply("No results found!");
            return;
        }

        const song = result.tracks[0]
        await queue.addTrack(song);

        let embed = new EmbedBuilder()
            .setDescription(`Àdded **[${song.title}](${song.url})** to the queue.`)
            .setThumbnail(song.thumbnail)
            .setFooter({text: `Duration: ${song.duration}`});

        if(!queue.isPlaying()) await queue.play(musicLink);

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