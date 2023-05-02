const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("paraekle")
        .setDescription("Etiketlenen kullanıcının veya bir rolün parasını yönetir.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('üye')
                .setDescription('Etiketlenen kullanıcının parasını yönetir.')
                .addUserOption(z => z.setName("etiket").setDescription("Parası yönetilcek kişiyi etiketle.").setRequired(true))
                .addStringOption(options => 
                    options
                    .setName("tur")
                    .setDescription("Hangi para birimini göndermek istersin.")
                    .setRequired(true)
                    .addChoices(
                        { name: 'Gümüş Geyik', value: 'gg' },
                        { name: 'Altın Ejderha', value: 'ae' },
                        { name: 'Demir Sikke', value: 'ds' }
                    )
                )
                .addIntegerOption(z => z.setName("miktar").setDescription("Yönetilcek miktarı girmelisin.").setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('rol')
                .setDescription('Etiketlenen kullanıcının parasını yönetir.')
                .addRoleOption(option => option.setName("rol").setDescription("Bir rolü etiketle.").setRequired(true))
                .addStringOption(options => 
                    options
                    .setName("tur")
                    .setDescription("Hangi para birimini göndermek istersin.")
                    .setRequired(true)
                    .addChoices(
                        { name: 'Gümüş Geyik', value: 'gg' },
                        { name: 'Altın Ejderha', value: 'ae' },
                        { name: 'Demir Sikke', value: 'ds' }
                    )
                )
                .addIntegerOption(option => option.setName("miktar").setDescription("Yatırılacak miktar.").setRequired(true)))
        , 
    run: async (client, interaction) => {
        if (interaction.options.getSubcommand() === "üye") {
            let user = interaction.options.getUser("etiket")
            let tur = interaction.options.getString("tur")
            let miktar = interaction.options.getInteger("miktar")
            if (!user) {
                return interaction.reply({
                    content: "Birini etiketlemelisin!",
                    ephemeral: true,
                });
            }
            if (!miktar) {
                return interaction.reply({
                    content: "Gönderilecek miktarı girmelisin!",
                    ephemeral: true,
                });
            }
            switch (tur) {
                case "gg":
                    db.add(`profil.${user.id}.gg`, miktar)
                    interaction.reply({content: `${interaction.user} adlı yetkili ${user} adlı kullanıcıya ${miktar} Gümüş Geyik ekledi.`})
                    break;
                case "ae":
                    db.add(`profil.${user.id}.ae`, miktar)
                    interaction.reply({content: `${interaction.user} adlı yetkili ${user} adlı kullanıcıya ${miktar} Altın Ejderha ekledi.`})
                    break;
                case "ds":
                    db.add(`profil.${user.id}.ds`, miktar)
                    interaction.reply({content: `${interaction.user} adlı yetkili ${user} adlı kullanıcıya ${miktar} Demir Sikke ekledi.`})
                    break;
            }
        } else if (interaction.options.getSubcommand() === "rol") {
            let rol = interaction.options.getRole("rol");
            if (!rol) {
                return interaction.reply({
                    content: "Birini etiketlemelisin!",
                    ephemeral: true,
                });
            }
            let miktar = interaction.options.getInteger("miktar");
            if (!miktar) {
                return interaction.reply({
                    content: "Gönderilecek miktarı girmelisin!",
                    ephemeral: true,
                });
            }
            if (miktar < 1) {
                return interaction.reply({
                    content: "Gönderilecek miktarı düzgün girmelisin!",
                    ephemeral: true,
                });
            }
            let tur = interaction.options.getString("tur")
            switch (tur) {
                case "gg":
                    interaction.guild.members.cache.forEach(userr => {
                        if (userr.roles.cache.has(rol.id)) {
                            db.add(`profil.${userr.id}.gg`, miktar)
                            interaction.reply({content: `${interaction.user} adlı yetkili ${rol} adlı role ${miktar} Gümüş Geyik ekledi.`})
                        }
                    })
                    break;
                case "ae":
                    interaction.guild.members.cache.forEach(userr => {
                        if (userr.roles.cache.has(rol.id)) {
                            db.add(`profil.${userr.id}.ae`, miktar)
                            interaction.reply({content: `${interaction.user} adlı yetkili ${rol} adlı role ${miktar} Altın Ejderha ekledi.`})
                        }
                    })
                    break;
                case "ds":
                    interaction.guild.members.cache.forEach(userr => {
                        if (userr.roles.cache.has(rol.id)) {
                            db.add(`profil.${userr.id}.ds`, miktar)
                            interaction.reply({content: `${interaction.user} adlı yetkili ${rol} adlı role ${miktar} Demir Sikke ekledi.`})
                        }
                    })
                    break;
            }
        }
    }
}