const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("para")
        .setDescription("Para ile ilgili komutlar.")
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('bilgi')
                .setDescription('Para bilgini gösterir.')
                .addUserOption(z => z.setName("etiket").setDescription("Parasına bakmak istediğin kullanıcıyı etiketle.")))
        .addSubcommand(subcommand =>
            subcommand
                .setName('dönüştür')
                .setDescription('Bankadan para çeker.')
                .addStringOption(options => 
                    options
                    .setName("donusen")
                    .setDescription("Dönüştürmek istediğin para birimini seç.")
                    .setRequired(true)
                    .addChoices(
                        { name: 'Gümüş Geyik', value: 'gg' },
                        { name: 'Altın Ejderha', value: 'ae' }
                    )
                )
                .addStringOption(options => 
                    options
                    .setName("donusturulcek")
                    .setDescription("Dönüşecek para birimini seç.")
                    .setRequired(true)
                    .addChoices(
                        { name: 'Gümüş Geyik', value: 'ggg' },
                        { name: 'Altın Ejderha', value: 'aee' }
                    )
                )
                .addIntegerOption(z => z.setName("miktar").setDescription("Dönüştürmek istediğin tutarı gir.").setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('gönder')
                .setDescription('Para göndermeni sağlar.')
                .addUserOption(z => z.setName("etiket").setDescription("Para göndermek istediğin kişiyi seç.").setRequired(true))
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
                .addIntegerOption(z => z.setName("miktar").setDescription("Gönderceğin para miktarını gir.").setRequired(true)))
        , 
    run: async (client, interaction) => {
        if (interaction.options.getSubcommand() === "bilgi") {
            let user = interaction.options.getUser("etiket") || interaction.user
            let ae = db.fetch(`profil.${user.id}.ae`) ? db.fetch(`profil.${user.id}.ae`) : 0;
            let gg = db.fetch(`profil.${user.id}.gg`) ? db.fetch(`profil.${user.id}.gg`) : 0;
            let ds = db.fetch(`profil.${user.id}.ds`) ? db.fetch(`profil.${user.id}.ds`) : 0;
            const emb = new Discord.EmbedBuilder()
            .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.avatarURL({dynamic: true})}`})
            .setFooter({ text: `${config.Footer}`, iconURL: `${user.avatarURL({dynamic: true}) ? user.avatarURL({dynamic: true}) : client.user.avatarURL({dynamic: true})}`})
            .setColor("000000")
            .setDescription(`**${user} Adlı Kullanıcının Bakiyesi:**`)
            .setImage("https://media.discordapp.net/attachments/1014292739971620935/1030888048319279134/ezgif-2-0be082524e.gif")
            .addFields(
                { name: '<:golden_dragon:1023595829107359824> Altın Ejderha', value: `${ae}`, inline: true},
                { name: '<:silver_stag:1023596744275144784> Gümüş Geyik', value: `${gg}`, inline: true},
                { name: '<:bravos_coin:1023598595821289612> Demir Sikke', value: `${ds}`, inline: true},
            );
            interaction.reply({embeds: [emb]})
        } else if (interaction.options.getSubcommand() === "dönüştür") {
            let miktar = interaction.options.getInteger("miktar")
            let donusen = interaction.options.getString("donusen")
            let donusturulcek = interaction.options.getString("donusturulcek")
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
            switch (donusen) {
                case "ae":
                    if (donusturulcek === "ggg") {
                        let aeDepo = db.fetch(`profil.${interaction.user.id}.ae`) ? db.fetch(`profil.${interaction.user.id}.ae`) : 0;
                        if (aeDepo < miktar) {
                            return interaction.reply({
                                content: "Altın Ejderha para biriminden elinde o kadar yok.",
                                ephemeral: true,
                            });
                        }
                        let donusMiktar = miktar*200
                        db.subtract(`profil.${interaction.user.id}.ae`, miktar)
                        db.add(`profil.${interaction.user.id}.gg`, donusMiktar)
                        interaction.reply({content: `Başarıyla Altın Ejderha'dan Gümüş Geyiğ'e dönüşüm yapıldı.\nYapılan Dönüşüm Miktarı: ${donusMiktar}`})
                    } else return interaction.reply({
                        content: "Aynı para birimleri arasında aktarım yapamazsın.",
                        ephemeral: true,
                    });
                    break;
                case "gg":
                    if (donusturulcek === "aee") {
                        let ggDepo = db.fetch(`profil.${interaction.user.id}.gg`) ? db.fetch(`profil.${interaction.user.id}.gg`) : 0;
                        if (ggDepo < miktar) {
                            return interaction.reply({
                                content: "Gümüş Geyik para biriminden elinde o kadar yok.",
                                ephemeral: true,
                            });
                        }
                        if (miktar < 200) {
                            return interaction.reply({
                                content: "Dönüşüm için en az 200 Gümüş Geyik gerekli.",
                                ephemeral: true,
                            });
                        }
                        let donusturulecekMiktar = Math.floor(miktar/200)
                        let artan = miktar%200
                        db.add(`profil.${interaction.user.id}.ae`, donusturulecekMiktar)
                        db.subtract(`profil.${interaction.user.id}.gg`, miktar)
                        db.add(`profil.${interaction.user.id}.gg`, artan)
                        interaction.reply({content: `Başarıyla Gümüş Geyik'ten Altın Ejderha'ya dönüşüm yapıldı.\nYapılan Dönüşüm Miktarı: ${donusturulecekMiktar}`})
                    } else return interaction.reply({
                        content: "Aynı para birimleri arasında aktarım yapamazsın.",
                        ephemeral: true,
                    });
                    break;
            }
        } else if (interaction.options.getSubcommand() === "gönder") {
            let user = interaction.options.getUser("etiket")
            if (user.id === interaction.user.id) {
                return interaction.reply({
                    content: "Kendine para gönderemezsin!",
                    ephemeral: true,
                });
            }
            let miktar = interaction.options.getInteger("miktar")
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
            let type = interaction.options.getString("tur")
            switch (type) {
                case "gg":
                    let gg = db.fetch(`profil.${interaction.user.id}.gg`) ? db.fetch(`profil.${interaction.user.id}.gg`) : 0;
                    if (gg < miktar) {
                        return interaction.reply({
                            content: "O kadar Gümüş Geyik'in bulunmamakta.",
                            ephemeral: true,
                        });
                    }
                    db.subtract(`profil.${interaction.user.id}.gg`, miktar)
                    db.add(`profil.${user.id}.gg`, miktar)
                    interaction.reply({content: `${interaction.user} adlı kullanıcıdan ${user} adlı kullanıcıya ${miktar} Gümüş Geyik gönderildi.`});
                    break;
                case "ae":
                    let ae = db.fetch(`profil.${interaction.user.id}.ae`) ? db.fetch(`profil.${interaction.user.id}.ae`) : 0;
                    if (ae < miktar) {
                        return interaction.reply({
                            content: "O kadar Altın Ejderha'n bulunmamakta.",
                            ephemeral: true,
                        });
                    }
                    db.subtract(`profil.${interaction.user.id}.ae`, miktar)
                    db.add(`profil.${user.id}.ae`, miktar)
                    interaction.reply({content: `${interaction.user} adlı kullanıcıdan ${user} adlı kullanıcıya ${miktar} Altın Ejderha gönderildi.`});
                    break;
                case "ds":
                    let ds = db.fetch(`profil.${interaction.user.id}.ds`) ? db.fetch(`profil.${interaction.user.id}.ds`) : 0;
                    if (ds < miktar) {
                        return interaction.reply({
                            content: "O kadar Demir Sikke'n bulunmamakta.",
                            ephemeral: true,
                        });
                    }
                    db.subtract(`profil.${interaction.user.id}.ds`, miktar)
                    db.add(`profil.${user.id}.ds`, miktar)
                    interaction.reply({content: `${interaction.user} adlı kullanıcıdan ${user} adlı kullanıcıya ${miktar} Demir Sikke gönderildi.`});
                    break;
            }
        }
    }
}