const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("seviye")
        .setDescription("Kullanıcının seviyesine bakarsınız!")
        .addUserOption(option =>
        option.setName('user')
            .setDescription('Etiketlediğiniz kişinin seviyesine bakarsınız.')
            .setRequired(false)),
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user') || interaction.user;
        let profil = db.fetch(`profil.${user.id}`) || {};
        let userss = db.fetch(`profil`);
        let userlar = Object.keys(userss || {}).map(md => {return {id: md, Total: (db.fetch(`profil.${md}.rpkelime`) || 0) }}).sort((a, b) => b.Total - a.Total).map(a => a);
        let userlarr = Object.keys(userss || {}).map(md => {return {id: md, Total: (db.fetch(`profil.${md}.genelkelime`) || 0) }}).sort((a, b) => b.Total - a.Total).map(a => a);
        let sira1 = "0";
        for (var i = 0; i < userlar.length; i++) {
            if (userlar[i].id === user.id) {
            sira1 += `${i + 1}`
            }
        }
        let sira2 = "0";
        for (var i = 0; i < userlarr.length; i++) {
            if (userlarr[i].id === user.id) {
            sira2 += `${i + 1}`
            }
        }
        const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.avatarURL({dynamic: true})}`})
        .setFooter({ text: `${config.Footer}`, iconURL: `${user.avatarURL({dynamic: true}) ? user.avatarURL({dynamic: true}) : client.user.avatarURL({dynamic: true})}`})
        .setColor("000000")
        .setDescription(`**${user} Adlı Kullanıcının Profili:**`)
        .addFields(
            { name: "Haftalık Bilgilendirme", value:`**Puanın:** ${profil.rpkelime || 0}\n**Sıralaman:** ${sira1 || 0}/${userlar.length || interaction.guild.memberCount}`, inline: true},
            { name: "Genel Bilgilendirme", value: `**Puanın:** ${profil.genelkelime || 0}\n**Sıralaman:** ${sira2 || 0}/${userlarr.length || interaction.guild.memberCount}`, inline: true},
        )

        interaction.reply({embeds: [embed]})
    }
};