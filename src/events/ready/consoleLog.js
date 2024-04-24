const {ActivityType} = require("discord.js");
module.exports = (client) => {
    console.log(`${client.user.tag} is online. ${new Date()}`);

    client.user.setActivity({
        name: '/play for music',
        type: ActivityType.Custom,
    });
};