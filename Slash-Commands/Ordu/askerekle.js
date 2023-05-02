const Discord = require("discord.js")
const config = require("../../Json/config.json")
const askerler = require("../../Json/asker.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("askerekle")
        .setDescription("Kullanıcıya asker ekleyin!")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Asker eklemek istenen kullanıcıyı seçin.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tur')
            .setDescription('Almak istediğin askeri seç!')
            .setRequired(true)
            .addChoices(
                { name: 'Acemi Piyade', value: 'acemi-piyade'},
                { name: 'Acemi Okçu', value: 'acemi-okçu'},
                { name: 'Acemi Süvari', value: 'acemi-süvari'},
                { name: 'Acemi Mızraklı', value: 'acemi-mızraklı'},
                { name: 'Tecrübeli Piyade', value: 'tecrübeli-piyade'},
                { name: 'Tecrübeli Okçu', value: 'tecrübeli-okçu'},
                { name: 'Tecrübeli Süvari', value: 'tecrübeli-süvari'},
                { name: 'Tecrübeli Mızraklı', value: 'tecrübeli-mızraklı'},
                { name: 'Usta Piyade', value: 'usta-piyade'},
                { name: 'Usta Okçu', value: 'usta-okçu'},
                { name: 'Usta Süvari', value: 'usta-süvari'},
                { name: 'Usta Mızraklı', value: 'usta-mızraklı'},
                { name: 'Eğitimli Piyade', value: 'eğitimli-piyade'},
                { name: 'Eğitimli Okçu', value: 'eğitimli-piyade'},
                { name: 'Eğitimli Süvari', value: 'eğitimli-süvari'},
                { name: 'Eğitimli Mızraklı', value: 'eğitimli-mızraklı'},
                { name: 'Mızraklı Lekesiz', value: 'mızraklı-lekesiz'},
                { name: 'Dothraki Süvarisi', value: 'dothraki-süvarisi'},
                { name: 'Kadırga', value: 'kadırga'},
                { name: 'Kalyon', value: 'kalyon'},
                { name: 'Kuğu Gemisi', value: 'kuğu-gemisi'},
                { name: 'Dramond', value: 'dramond'},
                { name: 'Uzun Gemi', value: 'uzun-gemi'},
                { name: 'Ticaret Gemisi', value: 'ticaret-gemisi'},
            )
        )
        .addIntegerOption(z => z.setName("miktar").setDescription("Alacağın asker miktarını girmelisin.").setRequired(true))
    ,
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const tur = interaction.options.getString('tur');
        const miktar = interaction.options.getInteger('miktar');
        let profil = db.fetch(`profil.${user.id}`);
        let haneId = db.fetch(`profil.${user.id}.haneId`);
        if (!haneId) return interaction.reply({content: "Haneye mensup değilsin ordu alamazsın."})
        let hanebilgi = db.fetch(`haneler`) || [];
        let hane = hanebilgi.find(z => z.haneId == haneId);
        if (!hane) return interaction.reply({content: "Hane bulunamadı!"})
        let ordum = db.fetch(`${haneId}`) || [];
        let veri = askerler.askeriye[tur]
        let asker = ordum.find(z => z.id === veri.id)
        if(!asker) asker = {...veri, adet:0};
        if(ordum.length != 0) db.pull(`${haneId}`, veri.id, "id")
        db.push(`${haneId}`,{...veri, adet:parseInt(miktar)+parseInt(asker.adet)});
        interaction.reply({content: `**${veri.isim}** adındaki askerlerden ${miktar} adet ${user} adlı kullanıcıya eklendi.`})
    }
};