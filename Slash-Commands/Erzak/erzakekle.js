const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("erzakekle")
        .setDescription("ID'si girilen haneye erzak ekler!")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .addStringOption(option => 
            option.setName('id')
            .setDescription('Hane ID\'sini giriniz.')
            .setRequired(true)
        )
        .addStringOption(options => 
            options
            .setName("tur")
            .setDescription("Hangi tür erzak ekleyeceğinizi seçin.")
            .setRequired(true)
            .addChoices(
                { name: 'Tahıl', value: 'tah' },
                { name: 'Peynir', value: 'pey' },
                { name: 'Kırmızı Et', value: 'kir' },
                { name: 'Beyaz Et', value: 'bey' },
                { name: 'Süt', value: 'sut' },
                { name: 'Şarap', value: 'sar' },
                { name: 'Meyve', value: 'mey' },
                { name: 'Sebze', value: 'seb' },
                { name: 'Balık', value: 'bal' },
                { name: 'Bira', value: 'bir' }
            )
        )
        .addIntegerOption(z => z.setName("miktar").setDescription("Eklenecek erzak miktarı.").setRequired(true))
        ,
    run: async (client, interaction) => {
        const id = interaction.options.getString('id');
        const tur = interaction.options.getString('tur');
        const miktar = interaction.options.getInteger('miktar');
        let hanebilgi = db.fetch(`haneler`) || [];
        let hane = hanebilgi.find(z => z.haneId == id);
        if (!hane) return interaction.reply({content: "Böyle bir hane yok."})
        switch (tur) {
            case "tah":
                db.pull(`haneler`, hane.haneId, "haneId")
                db.push(`haneler`, {...hane, tahil: Number(hane.tahil + miktar)})
                break;
            case "pey":
                db.pull(`haneler`, hane.haneId, "haneId")
                db.push(`haneler`, {...hane, peynir: Number(hane.peynir + miktar)})
                break;
            case "kir":
                db.pull(`haneler`, hane.haneId, "haneId")
                db.push(`haneler`, {...hane, kirmizi: Number(hane.kirmizi + miktar)})
                break;
            case "bey":
                db.pull(`haneler`, hane.haneId, "haneId")
                db.push(`haneler`, {...hane, beyaz: Number(hane.beyaz + miktar)})
                break;
            case "sut":
                db.pull(`haneler`, hane.haneId, "haneId")
                db.push(`haneler`, {...hane, sut: Number(hane.sut + miktar)})
                break;
            case "sar":
                db.pull(`haneler`, hane.haneId, "haneId")
                db.push(`haneler`, {...hane, sarap: Number(hane.sarap + miktar)})
                break;
            case "mey":
                db.pull(`haneler`, hane.haneId, "haneId")
                db.push(`haneler`, {...hane, meyve: Number(hane.meyve + miktar)})
                break;
            case "seb":
                db.pull(`haneler`, hane.haneId, "haneId")
                db.push(`haneler`, {...hane, sebze: Number(hane.sebze + miktar)})
                break;
            case "bal":
                db.pull(`haneler`, hane.haneId, "haneId")
                db.push(`haneler`, {...hane, balik: Number(hane.balik + miktar)})
                break;
            case "bir":
                db.pull(`haneler`, hane.haneId, "haneId")
                db.push(`haneler`, {...hane, bira: Number(hane.bira + miktar)})
                break;
        }
        interaction.reply({content: `${hane.haneIsmi} adlı haneye ${miktar} ${tur} eklendi.`})
    }
};