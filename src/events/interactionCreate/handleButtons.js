const {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} = require('discord.js');

const {wait} = require('../../utils/wait');
const {button} = require('../../utils/constants');
const editQueueDashboard = require("../../utils/editQueueDashboard");

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
            if (queue.node.isPaused()) {
                queue.node.resume();
            } else {
                queue.node.pause();
            }

            const row = editQueueDashboard(queue);

            await interaction.update({components: [row]});
        }
            break;
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

            const row = editQueueDashboard(queue);

            await interaction.update({components: [row]});
        }
            break;
        case 'Playing-Loop': {
            if (queue.repeatMode === 1) {
                queue.setRepeatMode(0);
            } else {
                queue.setRepeatMode(1);
            }

            const row = editQueueDashboard(queue);

            await interaction.update({components: [row]});
        }
            break;
        case 'Playing-Stop': {
            if (!queue.deleted) {
                queue.delete();
            }

            if (queue.dashboard) {
                queue.dashboard.delete();
            }

            if (queue.queueContent && queue.queueContent.message) {
                queue.queueContent.message.delete();
            }

            await interaction.reply('Bye, Bye!');
        }
            break;
        case 'Playing-Shuffle': {
            queue.tracks.shuffle();
            await interaction.reply('I\'ve mixed things up a bit in the queue.');
        }
            break;
        case 'Queue-Back': {
            let tracks = queue.queueContent.messageTracks;

            let page = queue.queueContent.page;

            const length = tracks.length;

            tracks = tracks.slice(10 * (page - 1), 10 * page);
            tracks.push(`And **${length - 10 * page}** more...`);
            page--;

            const queueEmbed = new EmbedBuilder()
                .setTitle('Queue')
                .setDescription(tracks.join('\n'));

            if (page === 0) {
                const forwardButton = new ButtonBuilder().setCustomId('Queue-Forward').setEmoji(button.skip).setStyle(ButtonStyle.Secondary);
                const row = new ActionRowBuilder().addComponents(forwardButton);
                queue.queueContent.message = await interaction.update({embeds: [queueEmbed], components: [row]});
            } else {
                const backButton = new ButtonBuilder().setCustomId('Queue-Back').setEmoji(button.back).setStyle(ButtonStyle.Secondary);
                const forwardButton = new ButtonBuilder().setCustomId('Queue-Forward').setEmoji(button.skip).setStyle(ButtonStyle.Secondary);
                const row = new ActionRowBuilder().addComponents(backButton, forwardButton);
                queue.queueContent.message = await interaction.update({embeds: [queueEmbed], components: [row]});
            }
            queue.queueContent.page = page;
        }
            break;
        case 'Queue-Forward': {
            let tracks = queue.queueContent.messageTracks;

            let page = queue.queueContent.page;

            const length = tracks.length;

            page++;

            if (length < 10 * (page + 1)) {
                tracks = tracks.slice(10 * page, length);
            } else {
                tracks = tracks.slice(10 * page, 10 * (page + 1));
                tracks.push(`And **${length - 10 * (page + 1)}** more...`);
            }

            const queueEmbed = new EmbedBuilder()
                .setTitle('Queue')
                .setDescription(tracks.join('\n'));

            if (length < 10 * (page + 1)) {
                const backButton = new ButtonBuilder().setCustomId('Queue-Back').setEmoji(button.back).setStyle(ButtonStyle.Secondary);
                const row = new ActionRowBuilder().addComponents(backButton);
                queue.queueContent.message = await interaction.update({embeds: [queueEmbed], components: [row]});
            } else {
                const backButton = new ButtonBuilder().setCustomId('Queue-Back').setEmoji(button.back).setStyle(ButtonStyle.Secondary);
                const forwardButton = new ButtonBuilder().setCustomId('Queue-Forward').setEmoji(button.skip).setStyle(ButtonStyle.Secondary);
                const row = new ActionRowBuilder().addComponents(backButton, forwardButton);
                queue.queueContent.message = await interaction.update({embeds: [queueEmbed], components: [row]});
            }
            queue.queueContent.page = page;
        }
            break;
    }
};