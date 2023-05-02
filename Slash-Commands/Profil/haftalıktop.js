const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("sıralama")
        .setDescription("Sunucu sıralamasına bakarsınız!")
    ,
    run: async (client, interaction) => {
        let profil = db.fetch(`profil.${interaction.user.id}`) || {};
        let userss = db.fetch(`profil`);
        let userlar = Object.keys(userss || {}).map(md => {return {id: md, Total: (db.fetch(`profil.${md}.rpkelime`) || 0) }}).sort((a, b) => b.Total - a.Total).map(a => a);
        let userlarr = Object.keys(userss || {}).map(md => {return {id: md, Total: (db.fetch(`profil.${md}.genelkelime`) || 0) }}).sort((a, b) => b.Total - a.Total).map(a => a);
        let kelimeamk = [];
        let genelamk = [];
        for (let i = 0; i < 10; i++) {
            if(userlar[i]){
                let kelime = db.fetch(`profil.${userlar[i].id}.rpkelime`) || 0;
                kelimeamk.push({sıra: i+1, name: `<@${userlar[i].id}>`, value: `Kelime: ${kelime}`});
            }
            if(userlarr[i]){
                let kelime = db.fetch(`profil.${userlar[i].id}.genelkelime`) || 0;
                genelamk.push({sıra: i+1, name: `<@${userlar[i].id}>`, value: `Kelime: ${kelime}`});
            }
        }
        let kelime_UwU = "";
        let genel_UWU = "";
        kelimeamk.forEach(a =>{
            kelime_UwU += `${a.sıra}┆${a.name} \`${a.value}\`\n`;
        });
        genelamk.forEach(a =>{
            genel_UWU += `${a.sıra}┆${a.name} \`${a.value}\`\n`;
        });
        kelime_UwU = kelime_UwU.replace("1┆", "🥇┆")
        kelime_UwU = kelime_UwU.replace("2┆", "🥈┆")
        kelime_UwU = kelime_UwU.replace("3┆", "🥉┆")
        genel_UWU = genel_UWU.replace("1┆", "🥇┆")
        genel_UWU = genel_UWU.replace("2┆", "🥈┆")
        genel_UWU = genel_UWU.replace("3┆", "🥉┆")
        const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.avatarURL({dynamic: true})}`})
        .setFooter({ text: `${config.Footer}`, iconURL: `${interaction.user.avatarURL({dynamic: true}) ? interaction.user.avatarURL({dynamic: true}) : client.user.avatarURL({dynamic: true})}`})
        .setColor("000000")
        .addFields(
            { name: "Haftalık Sıralama", value:`${kelime_UwU || "Sırada kimse yok."}`, inline: true},
            { name: "Genel Sıralama", value: `${genel_UWU || "Sırada kimse yok."}`, inline: true},
        )

        interaction.reply({embeds: [embed]})
    }
};