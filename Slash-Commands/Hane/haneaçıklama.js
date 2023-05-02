const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("haneaçıklama")
        .setDescription("Hane'nin açıklamasını düzenlersin!")
        .addStringOption(option => 
            option.setName('aciklama')
            .setDescription('Hane açıklaması.')
            .setRequired(true)
            .setMaxLength(250)
            .setMinLength(0)
        )
        ,
    run: async (client, interaction) => {
        const aciklama = interaction.options.getString('aciklama');
        let profil = db.fetch(`profil.${interaction.user.id}.haneId`);
        if (!profil) return interaction.reply({content: "Kullanıcının hanesi yok."})
        let hanebilgi = db.fetch(`haneler`) || [];
        let hane = hanebilgi.find(z => z.haneId == profil);
        if (!hane) return interaction.reply({content: "Kullanıcının hanesi yok."})
        if (hane.haneLider !== interaction.user.id) return interaction.reply({content: "Kullanıcı hane lideri değil."})
        db.pull("haneler", hane.haneId, "haneId");
        db.push("haneler", {...hane, haneDes: aciklama})
        interaction.reply({content: "Açıklama değiştirildi."})
    }
};