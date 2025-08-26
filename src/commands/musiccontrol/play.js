const {ApplicationCommandOptionType} = require('discord.js');
const {useMainPlayer} = require("discord-player");

module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const player = useMainPlayer();

        if (!interaction.member.voice.channel) {
            await interaction.editReply({
                content: 'You must be in a voice channel to use this command!',
                ephemeral: true
            });
            return;
        }

        const musicLink = interaction.options.get('music-link').value;
        
        try {
            const result = await player.play(interaction.member.voice.channel, musicLink, {
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
            
            await interaction.editReply(`Successfully added \`${result.track.title}\` by \`${result.track.author}\` to the queue.`)
        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while trying to play the music.');
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