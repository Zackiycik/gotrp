const Discord = require("discord.js")
const config = require("../../Json/config.json")
const askerler = require("../../Json/asker.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("askertopla")
        .setDescription("Asker satın alırsın!")
        .addStringOption(option =>
            option.setName('tur')
            .setDescription('Almak istediğin askeri seç!')
            .setRequired(true)
            .addChoices(
                { name: 'Acemi Piyade', value: 'acemi-piyade'},
                { name: 'Acemi Okçu', value: 'acemi-okçu'},
                { name: 'Acemi Süvari', value: 'acemi-süvari'},
                { name: 'Acemi Mızraklı', value: 'acemi-mızraklı'},
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
        const tur = interaction.options.getString('tur');
        const miktar = interaction.options.getInteger('miktar');
        let profil = db.fetch(`profil.${interaction.user.id}`);
        let haneId = db.fetch(`profil.${interaction.user.id}.haneId`);
        if (!haneId) return interaction.reply({content: "Haneye mensup değilsin ordu alamazsın."})
        let hanebilgi = db.fetch(`haneler`) || [];
        let hane = hanebilgi.find(z => z.haneId == haneId);
        if (!hane) return interaction.reply({content: "Hane bulunamadı!"})
        if (hane.haneLider !== interaction.user.id) return interaction.reply({content: "Hane lideri değilsin."})
        let veri = askerler.askeriye[tur]
        let ordum = db.fetch(`${haneId}`) || [];
        switch (veri.kategori) {
            case "acemi":
                let paramiktar1 = veri.fiyat.miktar * miktar
                if (profil.irk == "Essoslu") return interaction.reply({content: "Bu askerleri ırkın sebebiyle alamazsın."})
                if (hane.haneae < paramiktar1) return interaction.reply({content: "Hanenin o kadar Altın Ejderi yok."})
                let asker1 = ordum.find(z => z.id === veri.id)
                if(!asker1) asker1 = {adet:0};
                if(ordum.length != 0) db.pull(`${haneId}`, veri.id, "id")
                db.pull(`haneler`, hane.haneId, "haneId")
                db.push(`${haneId}`,{...veri, adet:Number(miktar+asker1.adet)});
                db.push(`haneler`, {...hane, haneae: Number(hane.haneae - paramiktar1)})
                break;
            case "eğitimli":
                let paramiktar2 = veri.fiyat.miktar * miktar
                if (profil.irk == "İlk İnsanlar" || profil.irk == "Andallar" || profil.irk == "Rhoynarlar") return interaction.reply({content: "Bu askerleri ırkın sebebiyle alamazsın."})
                if (hane.haneae < paramiktar2) return interaction.reply({content: "Hanenin o kadar Demir Sikke yok."})
                let asker2 = ordum.find(z => z.id === veri.id)
                if(!asker2) asker2 = {adet:0};
                if(ordum.length != 0) db.pull(`${haneId}`, veri.id, "id")
                db.pull(`haneler`, hane.haneId, "haneId")
                db.push(`${haneId}`,{...veri, adet:Number(miktar+asker2.adet)});
                db.push(`haneler`, {...hane, haneae: Number(hane.haneds - paramiktar2)})
                break;
            case "lekesiz":
                let paramiktar3 = veri.fiyat.miktar * miktar
                if (profil.irk == "İlk İnsanlar" || profil.irk == "Andallar" || profil.irk == "Rhoynarlar") return interaction.reply({content: "Bu askerleri ırkın sebebiyle alamazsın."})
                if (hane.haneae < paramiktar3) return interaction.reply({content: "Hanenin o kadar Demir Sikke yok."})
                let asker3 = ordum.find(z => z.id === veri.id)
                if(!asker3) asker3 = {adet:0};
                if(ordum.length != 0) db.pull(`${haneId}`, veri.id, "id")
                db.pull(`haneler`, hane.haneId, "haneId")
                db.push(`${haneId}`,{...veri, adet:Number(miktar+asker3.adet)});
                db.push(`haneler`, {...hane, haneae: Number(hane.haneds - paramiktar3)})
                break;
            case "dothraki":
                let paramiktar4 = veri.fiyat.miktar * miktar
                if (profil.irk == "İlk İnsanlar" || profil.irk == "Andallar" || profil.irk == "Rhoynarlar") return interaction.reply({content: "Bu askerleri ırkın sebebiyle alamazsın."})
                if (hane.haneae < paramiktar4) return interaction.reply({content: "Hanenin o kadar Demir Sikke yok."})
                let asker4 = ordum.find(z => z.id === veri.id)
                if(!asker4) asker4 = {adet:0};
                if(ordum.length != 0) db.pull(`${haneId}`, veri.id, "id")
                db.pull(`haneler`, hane.haneId, "haneId")
                db.push(`${haneId}`,{...veri, adet:Number(miktar+asker4.adet)});
                db.push(`haneler`, {...hane, haneae: Number(hane.haneds - paramiktar4)})
                break;
            case "gemi":
                if (profil.irk == "İlk İnsanlar" || profil.irk == "Andallar" || profil.irk == "Rhoynarlar" || profil.irk == "Valyrialılar") {
                    let paramiktar5 = veri.fiyat.westeros.miktar * miktar
                    if (hane.haneae < paramiktar5) return interaction.reply({content: "Hanenin o kadar Altın Ejderi yok."})
                    let asker5 = ordum.find(z => z.id === veri.id)
                    if(!asker5) asker5 = {adet:0};
                    if(ordum.length != 0) db.pull(`${haneId}`, veri.id, "id")
                    db.pull(`haneler`, hane.haneId, "haneId")
                    db.push(`${haneId}`,{...veri, adet:Number(miktar+asker5.adet)});
                    db.push(`haneler`, {...hane, haneae: Number(hane.haneae - paramiktar5)})
                } else {
                    let paramiktar5 = veri.fiyat.essos.miktar * miktar
                    if (hane.haneae < paramiktar5) return interaction.reply({content: "Hanenin o kadar Demir Sikkesi yok."})
                    let asker5 = ordum.find(z => z.id === veri.id)
                    if(!asker5) asker5 = {adet:0};
                    if(ordum.length != 0) db.pull(`${haneId}`, veri.id, "id")
                    db.pull(`haneler`, hane.haneId, "haneId")
                    db.push(`${haneId}`,{...veri, adet:Number(miktar+asker5.adet)});
                    db.push(`haneler`, {...hane, haneds: Number(hane.haneae - paramiktar5)})
                }
                break;
        }
        interaction.reply({content: "Asker eklendi"})
    }
};