module.exports = async (client, guildId) => {
    let applicationCommands;

    if (guildId) {
        const guild = await client.guilds.fetch(guildId);
        applicationCommands = guild.commands;
    } else {
        applicationCommands = await client.applicationCommands.commands;
    }

    await applicationCommands.fetch();
    return applicationCommands;
}