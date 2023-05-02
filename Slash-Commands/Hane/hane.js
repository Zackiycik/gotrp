const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("hane")
        .setDescription("Belirtilen hane hakkında bilgiler gösterilir!")
        .addUserOption(option =>
        option.setName('user')
            .setDescription('Lütfen görmek istediğiniz bir hane için o hanenin kullanıcılarından birisini seçin.')
            .setRequired(false)),
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user') || interaction.user
        let profil = db.fetch(`profil.${user.id}.haneId`);
        if (!profil) return interaction.reply({content: "Kullanıcının hanesi yok."})
        let hanebilgi = db.fetch(`haneler`) || [];
        let hane = hanebilgi.find(z => z.haneId == profil);
        if (!hane) return interaction.reply({content: "Kullanıcının hanesi yok."})
        const emb = new Discord.EmbedBuilder()
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.avatarURL({dynamic: true})}`})
        .setFooter({ text: `${config.Footer}`, iconURL: `${user.avatarURL({dynamic: true}) ? user.avatarURL({dynamic: true}) : client.user.avatarURL({dynamic: true})}`})
        .setColor("000000")
        .setImage(`${hane.haneResmi ? hane.haneResmi : client.user.avatarURL({dynamic: true})}`)
        .addFields(
            {name: "Hane Bilgileri", value:`**Hane İsmi:** ${hane.haneIsmi}\n**Hane ID:** ${hane.haneId}\n**Hane Bilgilendirmesi:** ${hane.haneDes}\n**Hane Lider:** <@${hane.haneLider}>`, inline: true},
            {name: "Hane Statları", value: `**Şan:** ${hane.şan}\n**Güç:** ${hane.güc}\n**Onur:** ${hane.onur}\n**Refah:** ${hane.refah}/10\n`, inline: true},
            {name: "Hane Üyeleri", value: `${hane.haneUye.map(z => "<@" + z + ">")}`, inline: false},
            {name: "Hane Erzakları", value: `**Tahıl:** ${hane.tahil}\n**Peynir:** ${hane.peynir}\n**Kırmızı Et:** ${hane.kirmizi}\n**Beyaz Et:** ${hane.beyaz}\n**Süt:** ${hane.sut}\n**Şarap:** ${hane.sarap}\n**Meyve:** ${hane.meyve}\n**Sebze:** ${hane.sebze}\n**Balık:** ${hane.balik}\n**Bira:** ${hane.bira}\n`, inline: true},
            {name: "Hane Hazineleri", value: `**<:golden_dragon:1023595829107359824> Altın Ejderha:** ${hane.haneae}\n**<:silver_stag:1023596744275144784> Gümüş Geyik:** ${hane.hanegg}\n**<:bravos_coin:1023598595821289612> Demir Sikke:** ${hane.haneds}`, inline: true}
        )
        interaction.reply({embeds: [emb]})
    }
};