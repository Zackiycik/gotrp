const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { client, scommands } = require("../index.js");
const config = require("../Json/config.json");

client.on("ready", async () => {
    const rest = new REST({ version: '10' }).setToken(config.Token);
    client.user.setPresence({ activities: [{ name: 'Coding...' }] });

    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: scommands },
        );
        console.log(`A total of ${scommands.length} (/) commands were loaded.`);
    } catch (error) {
        console.error(error);
    }
    console.log(`${client.user.tag} online!.`);
})