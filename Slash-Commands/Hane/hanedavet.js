const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("hanedavet")
        .setDescription("Hane'ye birini çekmek için davet gönderir!")
        .addUserOption(z => z.setName("etiket").setDescription("Haneye çekmek istediğiniz kişiyi giriniz.").setRequired(true))
        ,
    run: async (client, interaction) => {
        const user = interaction.options.getUser('etiket');
        let profil1 = db.fetch(`profil.${interaction.user.id}.haneId`);
        if (!profil1) return interaction.reply({content: "Sen bir hane sahibi değilsin."})
        let hanebilgi = db.fetch(`haneler`) || [];
        let hane1 = hanebilgi.find(z => z.haneId == profil1);
        if (!hane1) return interaction.reply({content: "Sen bir hane sahibi değilsin."})
        let profil2 = db.fetch(`profil.${user.id}.haneId`);
        if (profil2) return interaction.reply({content: "Kullanıcı bir haneye mensub."})
        let hane2 = hanebilgi.find(z => z.haneId == profil2);
        if (hane2) return interaction.reply({content: "Kullanıcı bir haneye mensub."})
        if (hane1.haneLider !== interaction.user.id) return interaction.reply({content: "Sen hane lideri değilsin."})
        if (hane1.haneLider == user.id) return interaction.reply({content: "Kendini davet edemezsin."})
        let row1 = new Discord.ActionRowBuilder()
            .addComponents(new Discord.ButtonBuilder()
            .setStyle("Success")
            .setLabel("Onayla")
            .setCustomId("onay1"))
            .addComponents(new Discord.ButtonBuilder()
            .setStyle("Danger")
            .setLabel("Reddet")
            .setCustomId("red1"))
        let row2 = new Discord.ActionRowBuilder()
            .addComponents(new Discord.ButtonBuilder()
            .setStyle("Success")
            .setLabel("Onayla")
            .setCustomId("onay2"))
            .addComponents(new Discord.ButtonBuilder()
            .setStyle("Danger")
            .setLabel("Reddet")
            .setCustomId("red2"))
        interaction.reply({content: `${user}' adlı kullanıcı klana davet edildi.\nKlana katılmak için aşşağıdaki butonlardan seçim yapmalısın.`, components: [row1]})
        const filter = i => i.user.id == user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
        collector.on('collect', async z => {
            if (z.customId === "onay1") {
                const channel = interaction.guild.channels.cache.get('1028662616387764345')
                interaction.editReply({content: "Onay beklemektesiniz...", components: []})
                channel.send({content: `${user} adlı kullanıcı \`${hane1.haneIsmi}\` adlı haneye katılmak istiyor.`, components: [row2]})
                const collector2 = channel.createMessageComponentCollector({ time: 600000 });
                collector2.on('collect', async zz => {
                    if (zz.customId === "onay2") {
                        let newUye = hane1.haneUye || [];
                        newUye.push(`${user.id}`)
                        db.pull(`haneler`, hane1.haneId, "haneId")
                        db.push(`haneler`, {...hane1, haneUye: newUye})
                        db.set(`profil.${user.id}.haneId`, hane1.haneId)
                        channel.send({content: "Başarıyla onaylandı!", components: []})
                        interaction.editReply({content: "Klana başarıyla alındın.", components: []})
                    } else if (zz.costumId === "red2") {
                        channel.send({content: "Başarıyla reddedildi!", components: []})
                        interaction.editReply({content: "Yönetim reddetti.", components: []})
                    } else return;
                })
            } else if (z.costumId === "red1") {
                interaction.editReply({content: "İşlem başarı ile reddedildi.", components: []})
            } else return
        })
    }
};