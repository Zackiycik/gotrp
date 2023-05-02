const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("profil")
        .setDescription("Kullanıcının profiline bakarsınız!")
        .addUserOption(option =>
        option.setName('user')
            .setDescription('Etiketlediğiniz kişinin profiline bakarsınız.')
            .setRequired(false)),
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user') || interaction.user;
        let profil = db.fetch(`profil.${user.id}`) || {};
        let görüntü = db.fetch(`profil.${user.id}.görüntü`);
        if (!profil.nickname) return interaction.reply({content: "Kullanıcıya kayıt edilmemiş!"})
        if (!görüntü) return interaction.reply({content: "Kullanıcıya görüntü eklenmemiş!"})
        let inv1 = db.get(`profil.${user.id}.isletmeler`) || [];
        let liste1 = "";
        if(inv1.length == 0) liste1 = "İşletme sahibi değil."
        
        inv1.forEach((item) => {
            liste1 += `**${item.isim}:** \`${item.adet}\`\n`;
        });
        let inv2 = db.get(`profil.${user.id}.mülkler`) || [];
        let liste2 = "";
        if(inv2.length == 0) liste2 = "Mülk sahibi değil."
        
        inv2.forEach((item) => {
            liste2 += `**${item.isim}:** \`${item.adet}\`\n`;
        });
        const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.avatarURL({dynamic: true})}`})
        .setFooter({ text: `${config.Footer}`, iconURL: `${user.avatarURL({dynamic: true}) ? user.avatarURL({dynamic: true}) : client.user.avatarURL({dynamic: true})}`})
        .setColor("000000")
        .setDescription(`**${user} Adlı Kullanıcının Profili:**`)
        .setImage(`${görüntü ? görüntü : client.user.avatarURL({dynamic: true})}`)
        .addFields(
            { name: "Karakter Bilgileri", value:`**İsim:** ${profil.nickname || "Yok"}\n**Cinsiyet:** ${profil.cinsiyet || "Yok"}\n**Meslek:** ${profil.meslek || "Yok"}\n**Irk:** ${profil.irk || "Yok"}\n**Soy:** ${profil.soy || "Yok"}\n**Doğduğu Bölge:** ${profil.bolge || "Yok"}\n**Bulunduğu Bölge:** ${profil.bulundugubolge || "Yok"}\n**Hanesi:** ${profil.hane || "Yok"}`, inline: true},
            { name: "Karakter Statları", value: `**Çeviklik** ${profil.ceviklik|| 0}\n**Dayanıklılık** ${profil.dayaniklilik|| 0}\n**Güç** ${profil.güc|| 0}\n**Ticaret** ${profil.ticaret|| 0}\n**Dindarlık** ${profil.dindarlik|| 0}\n**Entrika** ${profil.entrika|| 0}`, inline: true},
            { name: "Karakter Parası", value: `**<:golden_dragon:1023595829107359824> Altın Ejderha:** ${profil.ae || 0}\n**<:silver_stag:1023596744275144784> Gümüş Geyik:** ${profil.gg || 0}\n**<:bravos_coin:1023598595821289612> Demir Sikke:** ${profil.ds || 0}`, inline: false},
            { name: "Karakter Mülkleri", value: `${liste2 || "Mülk sahibi değil."}`, inline: true},
            { name: "Karakter İşletmeleri", value: `${liste1 || "İşletme sahibi değil."}`, inline: true}
        )

        interaction.reply({embeds: [embed]})
    }
};