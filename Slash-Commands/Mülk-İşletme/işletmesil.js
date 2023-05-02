const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("işletmesil")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .setDescription("İşletme ekleme işlemi yapar!")
        .addUserOption(option =>
        option.setName('user')
            .setDescription('İşletme eklemek istediğin kullanıcıyı etiketle.')
            .setRequired(true))
        .addStringOption(option =>
        option.setName('isletmeler')
            .setDescription('Eklemek istediğin işletme türünü seçiniz.')
            .setRequired(true)
            .addChoices(
                { name: 'Büyük Ticaret Merkezi', value: 'bt' },
                { name: 'Orta Ticaret Merkezi', value: 'ot' },
                { name: 'Küçük Ticaret Merkezi', value: 'kt' },
                { name: 'Büyük Dükkan', value: 'bd' },
                { name: 'Orta Dükkan', value: 'od' },
                { name: 'Küçük Dükkan', value: 'kd' },
                { name: 'Taverna', value: 't' },
                { name: 'Haydut Kampı', value: 'hk' },
                { name: 'Paralı Asker Kampı', value: 'pak' },
                { name: 'Banka', value: 'banka' }
            )
        )
        , 
    run: async (client, interaction) => {
        let user = interaction.options.getUser("user");
        let islet = interaction.options.getString("isletmeler");
        let isletler = ""
        switch (islet) {
            case "bt":
                isletler = "Büyük Ticaret Merkezi"
                break;
            case "ot":
                isletler = "Orta Ticaret Merkezi"
                break;
            case "kt":
                isletler = "Küçük Ticaret Merkezi"
                break;
            case "bd":
                isletler = "Büyük Dükkan"
                break;
            case "od":
                isletler = "Orta Dükkan"
                break;
            case "kd":
                isletler = "Küçük Dükkan"
                break;
            case "t":
                isletler = "Taverna"
                break;
            case "hk":
                isletler = "Haydut Kampı"
                break;
            case "pak":
                isletler = "Paralı Asker Kampı"
                break;
            case "banka":
                isletler = "Banka"
                break;
        }
        let inv = db.get(`profil.${user.id}.isletmeler`) || [];
        let urun = inv.find(a => a.id == islet);
        if(!urun) return interaction.reply({content: "Kişinin böyle bir işletmesi yok."})
        if(inv.length != 0) db.pull(`profil.${user.id}.isletmeler`,islet,"id");
        db.push(`profil.${user.id}.isletmeler`, {isim: isletler, id:islet, adet: parseInt(urun.adet) - 1})
        let urko = inv.find(a => a.id == islet);
        if(urko.adet < 1) db.pull(`profil.${user.id}.isletmeler`,islet,"id");
        interaction.reply({content: "İşletme Silindi."})
    }
}