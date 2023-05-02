const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("mülkekle")
        .setDescription("Mülk ekleme işlemi yapar!")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .addUserOption(option =>
        option.setName('user')
            .setDescription('Mülk eklemek istediğin kullanıcıyı etiketle.')
            .setRequired(true))
        .addStringOption(option =>
        option.setName('mulkler')
            .setDescription('Eklemek istediğin mülk türünü seçiniz.')
            .setRequired(true)
            .addChoices(
                { name: 'Büyük Malikane', value: 'buyuk' },
                    { name: 'Orta Malikane', value: 'orta' },
                    { name: 'Küçük Malikane', value: 'kucuk' },
                    { name: 'Şehir Evi', value: 'sehir' }
            )
        )
        , 
    run: async (client, interaction) => {
        let user = interaction.options.getUser("user");
        let mülk = interaction.options.getString("mulkler");
        let mülkler = ""
        switch (mülk) {
            case "buyuk":
                mülkler = "Büyük Malikane"
                break;
            case "orta":
                mülkler = "Orta Malikane"
                break;
            case "kucuk":
                mülkler = "Küçük Malikane"
                break;
            case "sehir":
                mülkler = "Şehir Evi"
                break;
        }
        let inv = db.get(`profil.${user.id}.mülkler`) || [];
        let urun = inv.find(a => a.id == mülk);
        if(!urun) urun = {adet:0};
        if(inv.length != 0) db.pull(`profil.${user.id}.mülkler`,mülk,"id");
        db.push(`profil.${user.id}.mülkler`, {isim: mülkler, id:mülk, adet: parseInt(urun.adet) + 1})
        interaction.reply({content: "Mülk Eklendi."})
    }
}