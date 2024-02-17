const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (exceptions = []) => {
    let localCommands = [];

    const commandCatagories = getAllFiles(
        path.join(__dirname, '..', 'commands'),
        true
    )

    for (const commandCatagory of commandCatagories) {
        const commandFiles = getAllFiles(commandCatagory);

        for (commandFile of commandFiles) {
            const commandObject = require(commandFile);

            if (exceptions.includes(commandObject.name)) {
                continue;
            }

            localCommands.push(commandObject);
        }
    }

    return localCommands;
};