const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("haneayrıl")
        .setDescription("Bulunduğun haneden ayrılırsın.")
        ,
    run: async (client, interaction) => {
        let profil = db.fetch(`profil.${interaction.user.id}.haneId`);
        if (!profil) return interaction.reply({content: "Bir hanen yok zaten."})
        let hanebilgi = db.fetch(`haneler`) || [];
        let hane = hanebilgi.find(z => z.haneId == profil);
        if (!hane) return interaction.reply({content: "Bir hanen yok zaten."})
        if (hane.haneLider === interaction.user.id) return interaction.reply({content: "Hane liderisin ayrılamazsın."})
        let row1 = new Discord.ActionRowBuilder()
            .addComponents(new Discord.ButtonBuilder()
            .setStyle("Success")
            .setLabel("Onayla")
            .setCustomId("onay1"))
            .addComponents(new Discord.ButtonBuilder()
            .setStyle("Danger")
            .setLabel("Reddet")
            .setCustomId("red1"))
        interaction.reply({content: `Klandan ayrılmak istediğine emin misin?`, components: [row1]})
        const filter = i => i.user.id == interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
        collector.on('collect', async z => {
            if (z.customId === "onay1") {
                db.delete(`profil.${interaction.user.id}.haneId`)
                let newUye = [];
                let haned = hane.haneUye || []
                haned.forEach(z => {
                    if (z == interaction.user.id) return;
                    newUye.push(`${z}`)
                });
                db.pull(`haneler`, hane.haneId, "haneId")
                db.push(`haneler`, {...hane, haneUye: newUye})
                interaction.editReply({content: "Başarıyla Ayrıldın.", components: []})
            } else if (z.customId === "red1") {
                interaction.editReply({content: "Ayrılmadın.", components: []})
            } else return;
        })
    }
};