const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("erzakgönder")
        .setDescription("ID'si girilen haneye erzak gönderir!")
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Erzak göndermek istediğiniz kişiyi seçiniz.')
                .setRequired(true))
        .addStringOption(options => 
            options
            .setName("tur")
            .setDescription("Hangi tür erzak göndereceğinizi seçin.")
            .setRequired(true)
            .addChoices(
                { name: 'Tahıl', value: 'tah' },
                { name: 'Peynir', value: 'pey' },
                { name: 'Kırmızı Et', value: 'kir' },
                { name: 'Beyaz Et', value: 'bey' },
                { name: 'Süt', value: 'sut' },
                { name: 'Et', value: 'sar' },
                { name: 'Meyve', value: 'mey' },
                { name: 'Sebze', value: 'seb' },
                { name: 'Balık', value: 'bal' },
                { name: 'Bira', value: 'bir' }
            )
        )
        .addIntegerOption(z => z.setName("miktar").setDescription("Göndereceğiniz erzak miktarı.").setRequired(true))
        .addStringOption(options => 
            options
            .setName("para")
            .setDescription("Hangi para birimini göndermek istersin.")
            .setRequired(true)
            .addChoices(
                { name: 'Gümüş Geyik', value: 'gg' },
                { name: 'Altın Ejderha', value: 'ae' },
                { name: 'Demir Sikke', value: 'ds' }
            )
        )
        .addIntegerOption(z => z.setName("paramiktar").setDescription("Göndereceğiniz erzak miktarının fiyatı.").setRequired(true))
        ,
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const tur = interaction.options.getString('tur');
        const para = interaction.options.getString('para');
        const miktar = interaction.options.getInteger('miktar');
        const paramiktar = interaction.options.getInteger('paramiktar');
        let hanebilgi = db.fetch(`haneler`) || [];
        let profil1 = db.fetch(`profil.${user.id}.haneId`)
        if (!profil1) return interaction.reply({content: "Hanesi yok."})
        let profil2 = db.fetch(`profil.${interaction.user.id}.haneId`)
        if (!profil2) return interaction.reply({content: "Hanen yok."})
        let hane2 = hanebilgi.find(z => z.haneId == profil2);
        let hane1 = hanebilgi.find(z => z.haneId == profil1);
        if (!hane1) return interaction.reply({content: "Hanesi yok."})
        if (!hane2) return interaction.reply({content: "Hanen yok."})
        if (hane2.haneLider !== interaction.user.id) return interaction.reply({content: "Hane lideri değilsin."})
        if (hane1.haneLider !== user.id) return interaction.reply({content: "Hane lideri değil."})
        let row = new Discord.ActionRowBuilder()
            .addComponents(new Discord.ButtonBuilder()
            .setStyle("Success")
            .setLabel("Onayla")
            .setCustomId("onay"))
            .addComponents(new Discord.ButtonBuilder()
            .setStyle("Danger")
            .setLabel("Reddet")
            .setCustomId("red"))
        switch (tur) {
            case "tah":
                if (para === "ae") {
                    if (hane2.tahil < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine tahıl adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Altın Ejder'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneae < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneae: Number(hane1.haneae - paramiktar), tahil: Number(hane1.tahil + miktar)})
                            db.push(`haneler`, {...hane2, haneae: Number(hane2.haneae + paramiktar), tahil: Number(hane2.tahil - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "gg") {
                    if (hane2.tahil < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine tahıl adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Gümüş Geyik'tir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.hanegg < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, hanegg: Number(hane1.hanegg - paramiktar), tahil: Number(hane1.tahil + miktar)})
                            db.push(`haneler`, {...hane2, hanegg: Number(hane2.hanegg + paramiktar), tahil: Number(hane2.tahil - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "ds") {
                    if (hane2.tahil < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine tahıl adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Demir Sikke'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneds < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneds: Number(hane1.haneds - paramiktar), tahil: Number(hane1.tahil + miktar)})
                            db.push(`haneler`, {...hane2, haneds: Number(hane2.haneds + paramiktar), tahil: Number(hane2.tahil - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else return interaction.reply({content: "Hata aldım."})
                break;
            case "pey":
                if (para === "ae") {
                    if (hane2.peynir < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Peynir adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Altın Ejder'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneae < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneae: Number(hane1.haneae - paramiktar), peynir: Number(hane1.peynir + miktar)})
                            db.push(`haneler`, {...hane2, haneae: Number(hane2.haneae + paramiktar), peynir: Number(hane2.peynir - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "gg") {
                    if (hane2.peynir < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Peynir adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Gümüş Geyik'tir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.hanegg < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, hanegg: Number(hane1.hanegg - paramiktar), peynir: Number(hane1.peynir + miktar)})
                            db.push(`haneler`, {...hane2, hanegg: Number(hane2.hanegg + paramiktar), peynir: Number(hane2.peynir - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "ds") {
                    if (hane2.peynir < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Peynir adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Demir Sikke'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneds < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneds: Number(hane1.haneds - paramiktar), peynir: Number(hane1.peynir + miktar)})
                            db.push(`haneler`, {...hane2, haneds: Number(hane2.haneds + paramiktar), peynir: Number(hane2.peynir - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else return interaction.reply({content: "Hata aldım."})
                break;
            case "kir":
                if (para === "ae") {
                    if (hane2.kirmizi < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Kırmızı Et adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Altın Ejder'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneae < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneae: Number(hane1.haneae - paramiktar), kirmizi: Number(hane1.kirmizi + miktar)})
                            db.push(`haneler`, {...hane2, haneae: Number(hane2.haneae + paramiktar), kirmizi: Number(hane2.kirmizi - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "gg") {
                    if (hane2.kirmizi < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Kırmızı Et adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Gümüş Geyik'tir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.hanegg < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, hanegg: Number(hane1.hanegg - paramiktar), kirmizi: Number(hane1.kirmizi + miktar)})
                            db.push(`haneler`, {...hane2, hanegg: Number(hane2.hanegg + paramiktar), kirmizi: Number(hane2.kirmizi - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "ds") {
                    if (hane2.kirmizi < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Kırmızı Et adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Demir Sikke'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneds < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneds: Number(hane1.haneds - paramiktar), kirmizi: Number(hane1.kirmizi + miktar)})
                            db.push(`haneler`, {...hane2, haneds: Number(hane2.haneds + paramiktar), kirmizi: Number(hane2.kirmizi - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else return interaction.reply({content: "Hata aldım."})
                break;
            case "bey":
                if (para === "ae") {
                    if (hane2.beyaz < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Beyaz Et adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Altın Ejder'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneae < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneae: Number(hane1.haneae - paramiktar), beyaz: Number(hane1.beyaz + miktar)})
                            db.push(`haneler`, {...hane2, haneae: Number(hane2.haneae + paramiktar), beyaz: Number(hane2.beyaz - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "gg") {
                    if (hane2.beyaz < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Beyaz Et adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Gümüş Geyik'tir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.hanegg < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, hanegg: Number(hane1.hanegg - paramiktar), beyaz: Number(hane1.beyaz + miktar)})
                            db.push(`haneler`, {...hane2, hanegg: Number(hane2.hanegg + paramiktar), beyaz: Number(hane2.beyaz - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "ds") {
                    if (hane2.beyaz < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Beyaz Et adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Demir Sikke'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneds < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneds: Number(hane1.haneds - paramiktar), beyaz: Number(hane1.beyaz + miktar)})
                            db.push(`haneler`, {...hane2, haneds: Number(hane2.haneds + paramiktar), beyaz: Number(hane2.beyaz - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else return interaction.reply({content: "Hata aldım."})
                break;
            case "sut":
                if (para === "ae") {
                    if (hane2.sut < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Süt adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Altın Ejder'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneae < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneae: Number(hane1.haneae - paramiktar), sut: Number(hane1.sut + miktar)})
                            db.push(`haneler`, {...hane2, haneae: Number(hane2.haneae + paramiktar), sut: Number(hane2.sut - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "gg") {
                    if (hane2.sut < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Süt adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Gümüş Geyik'tir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.hanegg < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, hanegg: Number(hane1.hanegg - paramiktar), sut: Number(hane1.sut + miktar)})
                            db.push(`haneler`, {...hane2, hanegg: Number(hane2.hanegg + paramiktar), sut: Number(hane2.sut - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "ds") {
                    if (hane2.sut < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Süt adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Demir Sikke'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneds < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneds: Number(hane1.haneds - paramiktar), sut: Number(hane1.sut + miktar)})
                            db.push(`haneler`, {...hane2, haneds: Number(hane2.haneds + paramiktar), sut: Number(hane2.sut - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else return interaction.reply({content: "Hata aldım."})
                break;
            case "sar":
                if (para === "ae") {
                    if (hane2.sarap < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Şarap adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Altın Ejder'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneae < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneae: Number(hane1.haneae - paramiktar), sarap: Number(hane1.sarap + miktar)})
                            db.push(`haneler`, {...hane2, haneae: Number(hane2.haneae + paramiktar), sarap: Number(hane2.sarap - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "gg") {
                    if (hane2.sarap < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Şarap adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Gümüş Geyik'tir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.hanegg < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, hanegg: Number(hane1.hanegg - paramiktar), sarap: Number(hane1.sarap + miktar)})
                            db.push(`haneler`, {...hane2, hanegg: Number(hane2.hanegg + paramiktar), sarap: Number(hane2.sarap - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "ds") {
                    if (hane2.sarap < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Şarap adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Demir Sikke'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneds < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneds: Number(hane1.haneds - paramiktar), sarap: Number(hane1.sarap + miktar)})
                            db.push(`haneler`, {...hane2, haneds: Number(hane2.haneds + paramiktar), sarap: Number(hane2.sarap - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else return interaction.reply({content: "Hata aldım."})
                break;
            case "mey":
                if (para === "ae") {
                    if (hane2.meyve < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Meyve adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Altın Ejder'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneae < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneae: Number(hane1.haneae - paramiktar), meyve: Number(hane1.meyve + miktar)})
                            db.push(`haneler`, {...hane2, haneae: Number(hane2.haneae + paramiktar), meyve: Number(hane2.meyve - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "gg") {
                    if (hane2.meyve < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Meyve adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Gümüş Geyik'tir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.hanegg < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, hanegg: Number(hane1.hanegg - paramiktar), meyve: Number(hane1.meyve + miktar)})
                            db.push(`haneler`, {...hane2, hanegg: Number(hane2.hanegg + paramiktar), meyve: Number(hane2.meyve - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "ds") {
                    if (hane2.meyve < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Meyve adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Demir Sikke'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneds < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneds: Number(hane1.haneds - paramiktar), meyve: Number(hane1.meyve + miktar)})
                            db.push(`haneler`, {...hane2, haneds: Number(hane2.haneds + paramiktar), meyve: Number(hane2.meyve - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else return interaction.reply({content: "Hata aldım."})
                break;
            case "seb":
                if (para === "ae") {
                    if (hane2.sebze < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Sebze adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Altın Ejder'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneae < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneae: Number(hane1.haneae - paramiktar), sebze: Number(hane1.sebze + miktar)})
                            db.push(`haneler`, {...hane2, haneae: Number(hane2.haneae + paramiktar), sebze: Number(hane2.sebze - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "gg") {
                    if (hane2.sebze < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Sebze adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Gümüş Geyik'tir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.hanegg < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, hanegg: Number(hane1.hanegg - paramiktar), sebze: Number(hane1.sebze + miktar)})
                            db.push(`haneler`, {...hane2, hanegg: Number(hane2.hanegg + paramiktar), sebze: Number(hane2.sebze - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "ds") {
                    if (hane2.sebze < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Sebze adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Demir Sikke'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneds < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneds: Number(hane1.haneds - paramiktar), sebze: Number(hane1.sebze + miktar)})
                            db.push(`haneler`, {...hane2, haneds: Number(hane2.haneds + paramiktar), sebze: Number(hane2.sebze - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else return interaction.reply({content: "Hata aldım."})
                break;
            case "bal":
                if (para === "ae") {
                    if (hane2.balik < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Balık adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Altın Ejder'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneae < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneae: Number(hane1.haneae - paramiktar), balik: Number(hane1.balik + miktar)})
                            db.push(`haneler`, {...hane2, haneae: Number(hane2.haneae + paramiktar), balik: Number(hane2.balik - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "gg") {
                    if (hane2.balik < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Balık adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Gümüş Geyik'tir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.hanegg < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, hanegg: Number(hane1.hanegg - paramiktar), balik: Number(hane1.balik + miktar)})
                            db.push(`haneler`, {...hane2, hanegg: Number(hane2.hanegg + paramiktar), balik: Number(hane2.balik - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "ds") {
                    if (hane2.balik < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Balık adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Demir Sikke'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneds < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneds: Number(hane1.haneds - paramiktar), balik: Number(hane1.balik + miktar)})
                            db.push(`haneler`, {...hane2, haneds: Number(hane2.haneds + paramiktar), balik: Number(hane2.balik - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else return interaction.reply({content: "Hata aldım."})
                break;
            case "bir":
                if (para === "ae") {
                    if (hane2.bira < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Bira adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Altın Ejder'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneae < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneae: Number(hane1.haneae - paramiktar), bira: Number(hane1.bira + miktar)})
                            db.push(`haneler`, {...hane2, haneae: Number(hane2.haneae + paramiktar), bira: Number(hane2.bira - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "gg") {
                    if (hane2.bira < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Bira adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Gümüş Geyik'tir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.hanegg < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, hanegg: Number(hane1.hanegg - paramiktar), bira: Number(hane1.bira + miktar)})
                            db.push(`haneler`, {...hane2, hanegg: Number(hane2.hanegg + paramiktar), bira: Number(hane2.bira - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else if (para === "ds") {
                    if (hane2.bira < miktar) return interaction.reply({content: "Elinde o kadar erzak yok."})
                    interaction.reply({content: `${interaction.user} adlı kullanıcı ${user} adlı kullanıcının hanesine Bira adlı erzaktan ${miktar} gönderim yapılacaktır. Ödenecek tutar ${paramiktar} Demir Sikke'dir.`, components: [row]})
                    const filter = i => i.user.id == user.id;
                    const collector = interaction.channel.createMessageComponentCollector({ filter:filter, time: 600000 });
                    collector.on('collect', async z => {
                        if (z.customId === "onay") {
                            if (hane1.haneds < paramiktar) return interaction.editReply({content: "Elinde o kadar para yok", components: []})
                            db.pull(`haneler`, hane1.haneId, "haneId")
                            db.pull(`haneler`, hane2.haneId, "haneId")
                            db.push(`haneler`, {...hane1, haneds: Number(hane1.haneds - paramiktar), bira: Number(hane1.bira + miktar)})
                            db.push(`haneler`, {...hane2, haneds: Number(hane2.haneds + paramiktar), bira: Number(hane2.bira - miktar)})
                            interaction.editReply({content: "Satın alma işlemi gerçekleşti!", components: []})
                        } else if (z.customId === "red") {
                            interaction.editReply({content: "Satın alma işlemi reddedildi!", components: []})
                        } else return interaction.editReply({content: "Hata aldım.", components: []})
                    })
                } else return interaction.reply({content: "Hata aldım."})
                break;
        }
    }
};