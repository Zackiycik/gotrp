const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("kelimeekle")
        .setDescription("Kelime ekleme işlemi yapılır!")
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Kelime eklenecek kişiyi etiketle.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tur')
            .setDescription('Eklemek istediğiniz kelime türü!')
            .setRequired(true)
            .addChoices(
                { name: 'Haftalık', value: 'cev' },
                { name: 'Genel', value: 'day' },
            )
        )
        .addIntegerOption(z => z.setName("miktar").setDescription("Eklencek kelime miktarı.").setRequired(true))
        ,
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user') || interaction.user;
        const stat = interaction.options.getString('tur')
        const miktar = interaction.options.getInteger('miktar')
        switch (stat) {
            case "cev":
                db.add(`profil.${user.id}.rpkelime`, miktar)
                interaction.reply({content: "Kelime başarıyla eklendi."})
                break;
            case "day":
                db.add(`profil.${user.id}.genelkelime`, miktar)
                interaction.reply({content: "Kelime başarıyla eklendi."})
                break;
        }
    }
};