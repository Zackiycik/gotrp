const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("haneyatır")
        .setDescription("Hane'ye para yükler!")
        .addStringOption(options => 
            options
            .setName("tur")
            .setDescription("Hangi para birimini yüklemek istersin.")
            .setRequired(true)
            .addChoices(
                { name: 'Gümüş Geyik', value: 'gg' },
                { name: 'Altın Ejderha', value: 'ae' },
                { name: 'Demir Sikke', value: 'ds' }
            )
        )
        .addIntegerOption(z => z.setName("miktar").setDescription("Yükleyeceğin para miktarını gir.").setRequired(true))
        ,
    run: async (client, interaction) => {
        const tur = interaction.options.getString('tur');
        const miktar = interaction.options.getInteger('miktar');
        let profil = db.fetch(`profil.${interaction.user.id}.haneId`);
        if (!profil) return interaction.reply({content: "Kullanıcının hanesi yok."})
        let hanebilgi = db.fetch(`haneler`) || [];
        let hane = hanebilgi.find(z => z.haneId == profil);
        if (!hane) return interaction.reply({content: "Kullanıcının hanesi yok."})
        switch (tur) {
            case "aa":
                db.pull("haneler", hane.haneId, "haneId");
                db.push("haneler", {...hane, haneae: hane.haneae + miktar})
                interaction.reply({content: "Haneye para yüklendi."})
                break;
            case "gg":
                db.pull("haneler", hane.haneId, "haneId");
                db.push("haneler", {...hane, hanegg: hane.hanegg + miktar})
                interaction.reply({content: "Haneye para yüklendi."})
                break;
            case "ds":
                db.pull("haneler", hane.haneId, "haneId");
                db.push("haneler", {...hane, haneds: hane.haneds + miktar})
                interaction.reply({content: "Haneye para yüklendi."})
                break;
        }
    }
};