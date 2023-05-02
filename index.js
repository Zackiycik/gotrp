const { Client, GatewayIntentBits, Routes, Collection } = require('discord.js');
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences]});
const config = require('./Json/config.json');
const db = require("fera.db")


fs.readdir("./Events/", (err, files) => {
    if (err) console.log(err);
    let jsFiles = files.filter(z => z.split(".").pop() === "js");
    if (jsFiles <= 0) return console.log("Unfortunately I couldn't find the event to load...");
    jsFiles.forEach((f, i) => {
        require(`./Events/${f}`);
    });
});

const scommands = [];
const scommandFiles = fs.readdirSync('./Slash-Commands').filter(file => file.endsWith('.js'));
client.scommands = new Collection();

for (const sfile of scommandFiles) {
    const scommand = require(`./Slash-Commands/${sfile}`);
    scommands.push(scommand.data.toJSON());
    client.scommands.set(scommand.data.name, scommand);

}
fs.readdir("./Slash-Commands/", (err, files) => {
    if (err) console.error(err);
    files.forEach(fse => {
        fs.readdir(`./Slash-Commands/${fse}/`, (err, filess) => {
            filess.forEach(fsss => {
                const scommand = require(`./Slash-Commands/${fse}/${fsss}`);
                scommands.push(scommand.data.toJSON());
                client.scommands.set(scommand.data.name, scommand);
            });
        });
    });
});

module.exports = {
    client: client,
    scommands : scommands
};

client.login(config.Token);