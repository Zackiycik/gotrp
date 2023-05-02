const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("ordum")
        .setDescription("Kullanıcının ordusuna bakarsınız!")
        .addUserOption(option =>
        option.setName('user')
            .setDescription('Etiketlediğiniz kişinin ordusuna bakarsınız.')
            .setRequired(false)),
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user') || interaction.user;
        let profil = db.fetch(`profil.${user.id}.haneId`);
        if (!profil) return interaction.reply({content: "Kullanıcı bir haneye mensup değil bu yüzden ordusuna bakamazsın."})
        let ordu = db.fetch(`${profil}`) || [];
        let acemi = ''
        let tecrubeli = ''
        let usta = ''
        let essos = ''
        let lekesiz = ''
        let dothraki = ''
        let gemi = ''
        ordu.forEach((asker) => {
            if(asker.adet <= 0) return db.pull(`${profil}`, asker.id, "id");
            if(asker.kategori !== "acemi") return;
            acemi += `**${asker.isim}:** \`${asker.adet}\`\n`;
        });
        ordu.forEach((asker) => {
            if(asker.kategori !== "tecrübeli") return;
            tecrubeli += `**${asker.isim}:** \`${asker.adet}\`\n`;
        });
        ordu.forEach((asker) => {
            if(asker.kategori !== "usta") return;
            usta += `**${asker.isim}:** \`${asker.adet}\`\n`;
        });
        ordu.forEach((asker) => {
            if(asker.kategori !== "eğitimli") return;
            essos += `**${asker.isim}:** \`${asker.adet}\`\n`;
        });
        ordu.forEach((asker) => {
            if(asker.kategori !== "lekesiz") return;
            lekesiz += `**${asker.isim}:** \`${asker.adet}\`\n`;
        });
        ordu.forEach((asker) => {
            if(asker.kategori !== "dothraki") return;
            dothraki += `**${asker.isim}:** \`${asker.adet}\`\n`;
        });
        ordu.forEach((asker) => {
            if(asker.kategori !== "gemi") return;
            gemi += `**${asker.isim}:** \`${asker.adet}\`\n`;
        });
        const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.avatarURL({dynamic: true})}`})
        .setFooter({ text: `${config.Footer}`, iconURL: `${user.avatarURL({dynamic: true}) ? user.avatarURL({dynamic: true}) : client.user.avatarURL({dynamic: true})}`})
        .setColor("000000")
        .setDescription("https://pa1.narvii.com/6219/732f52714e9cafe71c18de5e79285b19f47a10ff_hq.gif")
        .setDescription(`**${user} Adlı Kullanıcının Ordusu:**`)
        .addFields(
            { name: "Acemi Birlikler", value: `${acemi || "Acemi birliğine sahip değilsin."}`, inline: true},
            { name: "Tecrübeli Birlikler", value: `${tecrubeli || "Tecrübeli birliğine sahip değilsin."}`, inline: true},
            { name: "Usta Birlikler", value: `${usta || "Usta birliğine sahip değilsin."}`, inline: true},
            { name: "Eğitimli Birlikler", value: `${essos || "Eğitimli birliklere sahip değilsin."}`, inline: true},
            { name: "Lekesizler Birliği", value: `${lekesiz || "Lekesizler birliğine sahip değilsin."}`, inline: true},
            { name: "Dothraki Birlikleri", value: `${dothraki || "Dothraki birliklerine sahip değilsin."}`, inline: true},
            { name: "Gemi Müfrezesi", value: `${gemi || "Gemi Müfrezesine sahip değilsin."}`, inline: true},
        )

        interaction.reply({embeds: [embed]})
    }
};