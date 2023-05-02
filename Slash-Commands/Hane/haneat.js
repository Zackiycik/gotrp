const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("hanedenat")
        .setDescription("Hane lideri olarak birini atarsın.")
        .addUserOption(z => z.setName("etiket").setDescription("Haneye çekmek istediğiniz kişiyi giriniz.").setRequired(true))
        ,
    run: async (client, interaction) => {
        const user = interaction.options.getUser('etiket');
        let profil1 = db.fetch(`profil.${interaction.user.id}.haneId`);
        if (!profil1) return interaction.reply({content: "Bir hanen yok zaten."})
        let hanebilgi = db.fetch(`haneler`) || [];
        let hane1 = hanebilgi.find(z => z.haneId == profil1);
        if (!hane1) return interaction.reply({content: "Bir hanen yok zaten."})
        let profil2 = db.fetch(`profil.${user.id}.haneId`);
        if (!profil2) return interaction.reply({content: "Bir hanesi yok."})
        let hane2 = hanebilgi.find(z => z.haneId == profil2);
        if (!hane2) return interaction.reply({content: "Bir hanesi yok."})
        if (hane1.haneLider !== interaction.user.id) return interaction.reply({content: "Hane lideri değilsin."})
        if (hane1.haneLider == user.id) return interaction.reply({content: "Kendini atamazsın."})
        if (profil1 !== profil2) return interaction.reply({content: "Aynı haneden değilsiniz."})
        let row1 = new Discord.ActionRowBuilder()
            .addComponents(new Discord.ButtonBuilder()
            .setStyle("Success")
            .setLabel("Onayla")
            .setCustomId("onay1"))
            .addComponents(new Discord.ButtonBuilder()
            .setStyle("Danger")
            .setLabel("Reddet")
            .setCustomId("red1"))
        interaction.reply({content: `Klandan ${user} adlı kullanıcıyı atmak istediğine emin misin?`, components: [row1]})
        const filter = i => i.user.id == interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
        collector.on('collect', async z => {
            if (z.customId === "onay1") {
                db.delete(`profil.${user.id}.haneId`)
                let newUye = [];
                let haned = hane1.haneUye || []
                haned.forEach(z => {
                    if (z == user.id) return;
                    newUye.push(`${z}`)
                });
                db.pull(`haneler`, hane1.haneId, "haneId")
                db.push(`haneler`, {...hane1, haneUye: newUye})
                interaction.editReply({content: "Başarıyla Atıldı.", components: []})
            } else if (z.customId === "red1") {
                interaction.editReply({content: "Atılmadı.", components: []})
            } else return;
        })
    }
};