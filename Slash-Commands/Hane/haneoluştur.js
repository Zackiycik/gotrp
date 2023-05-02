const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
function randomSayi(min,max){
    let klanlar = db.fetch("klanID") || [];
    let id = Math.floor(Math.random() * (max - min + 1) ) + min;
    if(klanlar.includes(id)) return randomSayi(min,max);
    else{
        return id;
    }
}
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("haneoluştur")
        .setDescription("Belirtilen hane hakkında bilgiler gösterilir!")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option.setName('user')
            .setDescription('Hane açacak kişiyi etiketleyiniz.')
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("ad")
            .setDescription("Açılan hanenin ismini giriniz.")
            .setRequired(true)    
        )
        ,
    run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const isim = interaction.options.getString('ad');
        if (user.bot) return interaction.reply({content: "Bu kullanıcı bir bot."})
        let profil = db.fetch(`profil.${user.id}`);
        let haneler = db.fetch(`haneler`) || [];
        let klanID = randomSayi(1, 100000)
        if (haneler.find(z => z.haneId === klanID)) return interaction.reply({content: "Komutu tekrar kullanın yapılan işlemde bu verilen ID başka klan tarafından alınmış."})
        db.set(`profil.${user.id}.haneId`, klanID)
        db.push(`haneler`, {
            haneId: klanID,
            haneIsmi: isim,
            haneae: 0,
            hanegg: 0,
            haneds: 0,
            haneLider: user.id,
            haneUye: [user.id],
            haneDes: "Hane Açıklaması Yok.",
            haneResmi: null,
            şan: 0,
            güc: 0,
            onur: 0,
            refah: 10,
            tahil: 0,
            peynir: 0,
            kirmizi: 0,
            beyaz: 0,
            sut: 0,
            sarap: 0,
            meyve: 0,
            sebze: 0,
            balik: 0,
            bira: 0
        })
        interaction.reply({content: "Etiketlediğin kullanıcı için hane başarı ile açıldı."})
    }
};