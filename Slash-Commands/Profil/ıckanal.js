const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("ıckanal")
        .setDescription("Rolleri sayacak kanalları ayarlarsın!")
        .setDMPermission(false)
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('durum')
            .setDescription('Kanalı eklemek mi çıkarmak mı istiyorsunuz?')
            .setRequired(true)
            .addChoices(
                { name: 'Ekle', value: 'ekle' },
                { name: 'Çıkar', value: 'cikar' }
            )
        )
        .addChannelOption(z => z.setName("kanal").setDescription("Kanalı etiketleyiniz.").setRequired(true))
        ,
    run: async (client, interaction) => {
        const durum = interaction.options.getString('durum')
        const kanal = interaction.options.getChannel('kanal')
        let kanallar = db.fetch(`rpkanal`) || [];
        switch (durum) {
            case "ekle":
                if (kanallar.find(z => z === kanal.id)) return interaction.reply({content: `Etiketlediğin kanal zaten eklenik.`})
                db.push(`rpkanal`, kanal.id)
                interaction.reply({content: `${kanal} başarıyla eklendi.`})
                break;
            case "cikar":
                if (!kanallar.find(z => z === kanal.id)) return interaction.reply({content: `Etiketlediğin kanal önceden eklenmemiş.`})
                db.pull(`rpkanal`, kanal.id)
                interaction.reply({content: `${kanal} başarıyla silindi.`})
                break;
        }
    }
};