const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("hanesancak")
        .setDescription("Hane'nin sancağını düzenlersin!")
        .addStringOption(option => 
            option.setName('link')
            .setDescription('Sancak resmi URL\'si.')
            .setRequired(true)
        )
        ,
    run: async (client, interaction) => {
        const link = interaction.options.getString('link');
        let profil = db.fetch(`profil.${interaction.user.id}.haneId`);
        if (!profil) return interaction.reply({content: "Kullanıcının hanesi yok."})
        let hanebilgi = db.fetch(`haneler`) || [];
        let hane = hanebilgi.find(z => z.haneId == profil);
        if (!hane) return interaction.reply({content: "Kullanıcının hanesi yok."})
        if (hane.haneLider !== interaction.user.id) return interaction.reply({content: "Kullanıcı hane lideri değil."})
        db.pull("haneler", hane.haneId, "haneId");
        db.push("haneler", {...hane, haneResmi: link})
        interaction.reply({content: "Görüntü eklendi."})
    }
};