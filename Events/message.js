const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { client, scommands } = require("../index.js");
const config = require("../Json/config.json");
const db = require("fera.db");

client.on("messageCreate", async (message) =>{
    if (message.author.bot) return;
    let wlkanal = db.get(`rpkanal`) || [];
    if(!wlkanal.includes(message.channel.id)) return;
    let kelime = message.content.split(" ").length || 1;
    db.add(`profil.${message.author.id}.rpkelime`, kelime)
    db.add(`profil.${message.author.id}.genelkelime`, kelime)
})