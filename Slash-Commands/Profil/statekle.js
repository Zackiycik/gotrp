const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("statdağıt")
        .setDescription("Kendi statlarınızı dağıtırsınız!")
        .addStringOption(option =>
            option.setName('stat')
            .setDescription('Eklemek istediğiniz stat türü!')
            .setRequired(true)
            .addChoices(
                { name: 'Çeviklik', value: 'cev' },
                { name: 'Dayanıklılık', value: 'day' },
                { name: 'Güç', value: 'guc' },
                { name: 'Ticaret', value: 'tic' },
                { name: 'Dindarlık', value: 'din' },
                { name: 'Entrika', value: 'ent' },
            )
        )
        .addIntegerOption(z => z.setName("miktar").setDescription("Eklencek stat miktarı.").setRequired(true))
        ,
    run: async (client, interaction) => {
        const stat = interaction.options.getString('stat')
        const miktar = interaction.options.getInteger('miktar')
        let profil = db.fetch(`profil.${interaction.user.id}.stat`)
        if (profil < miktar) return interaction.reply({content: `Elinde o kadar stat yok. Elinde kalan stat sayın **${profil}** tanedir.`})
        switch (stat) {
            case "cev":
                db.subtract(`profil.${interaction.user.id}.stat`, miktar)
                db.add(`profil.${interaction.user.id}.ceviklik`, miktar)
                interaction.reply({content: "Stat başarıyla eklendi."})
                break;
            case "day":
                db.subtract(`profil.${interaction.user.id}.stat`, miktar)
                db.add(`profil.${interaction.user.id}.dayaniklilik`, miktar)
                interaction.reply({content: "Stat başarıyla eklendi."})
                break;
            case "guc":
                db.subtract(`profil.${interaction.user.id}.stat`, miktar)
                db.add(`profil.${interaction.user.id}.güc`, miktar)
                interaction.reply({content: "Stat başarıyla eklendi."})
                break;
            case "tic":
                db.subtract(`profil.${interaction.user.id}.stat`, miktar)
                db.add(`profil.${interaction.user.id}.ticaret`, miktar)
                interaction.reply({content: "Stat başarıyla eklendi."})
                break;
            case "din":
                db.subtract(`profil.${interaction.user.id}.stat`, miktar)
                db.add(`profil.${interaction.user.id}.dindarlık`, miktar)
                interaction.reply({content: "Stat başarıyla eklendi."})
                break;
            case "ent":
                db.subtract(`profil.${interaction.user.id}.stat`, miktar)
                db.add(`profil.${interaction.user.id}.entrika`, miktar)
                interaction.reply({content: "Stat başarıyla eklendi."})
                break;
        }
    }
};