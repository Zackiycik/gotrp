const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("görüntüekle")
        .setDescription("Kullanıcıya görüntü eklersiniz!")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageRoles)
        .addUserOption(option =>
        option.setName('user')
            .setDescription('Görünüm eklenecek kişi.')
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('link')
            .setDescription('Karakter resmi URL\'si.')
            .setRequired(true)
        )
        ,
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const link = interaction.options.getString('link');
        db.set(`profil.${user.id}.görüntü`, `${link}`)
        interaction.reply({content: "Görüntü eklendi."})
    }
};