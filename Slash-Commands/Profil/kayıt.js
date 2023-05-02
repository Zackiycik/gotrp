const Discord = require("discord.js")
const config = require("../../Json/config.json")
const db = require("fera.db")
module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("kaydet")
        .setDescription("Yeni kullanıcı kaydeder!")
        .addUserOption(option =>
        option.setName('user')
            .setDescription('Kaydedilmek istenen kullanıcıyı seçin.')
            .setRequired(true))
        .addStringOption(option =>
        option.setName('nickname')
            .setDescription('Kaydedilmek istenen kullanıcının oyun içi adını girin!')
            .setRequired(true))
        .addStringOption(option =>
        option.setName('cinsiyet')
            .setDescription('Kaydedilmek istenen kullanıcının cinsiyetini girin!')
            .setRequired(true)
            .addChoices(
                { name: 'Erkek', value: 'erkek' },
                { name: 'Kadın', value: 'kadin' },
            )
            )
        .addStringOption(option =>
        option.setName('soy')
            .setDescription('Kaydedilmek istenen kullanıcının soy durumunu seçin')
            .setRequired(true)
            .addChoices(
            { name: 'Soylu', value: 'soylu' },
            { name: 'Piç', value: 'pic' },
            { name: 'Köylü', value: 'koylu' },
            )
            )
        .addStringOption(option =>
        option.setName('irk')
            .setDescription('Kaydedilmek istenen kullanıcının ırkını girin!')
            .setRequired(true)
            .addChoices(
                { name: 'Valyrialılar', value: 'valy' },
                { name: 'İlk İnsanlar', value: 'ilkin' },
                { name: 'Andallar', value: 'andal' },
                { name: 'Rhoynarlar', value: 'rhoy' },
                { name: 'Essoslu', value: 'ess' },
            )
            )
        .addStringOption(option =>
        option.setName('meslek')
            .setDescription('Kaydedilmek istenen kullanıcının mesleğini girin!')
            .setRequired(true)
            .addChoices(
                { name: 'Altın Pelerinler', value: 'pelerin' },
                { name: 'Kral Muhafızları', value: 'muhafız' },
                { name: 'Korsanlar', value: 'korsan' }, 
                { name: 'Haydutlar', value: 'haydut' }, 
                { name: 'Paralı Asker', value: 'paralı' },
                { name: 'Şövalye', value: 'sovalye' },
                { name: 'Yaver', value: 'yaver' },
                { name: 'Nedime/Hizmetçi', value: 'nedime' },
                { name: 'Tüccar', value: 'tuccar' },
                { name: 'Kral', value: 'kral' },
                { name: 'Prens/Prenses', value: 'prens' },
                { name: 'Lord/Leydi', value: 'lord' },
                { name: 'Gece Nöbetçisi', value: 'gece' }
            )
            )
        .addStringOption(option =>
                option.setName('bolge')
                    .setDescription('Kaydedilmek istenen kullanıcının şehrini girin!')
                    .setRequired(true)
                    .addChoices(
                    { name: 'Taç Toprakları', value: 'tac' },
                    { name: 'Demir Adalar', value: 'demira' },
                    { name: 'Menzil', value: 'menzil' },
                    { name: 'Nehir Toprakları', value: 'nehir' },
                    { name: 'Fırtına Toprakları', value: 'firtina' },
                    { name: 'Vadi', value: 'vadi' },
                    { name: 'Batı Toprakları', value: 'bati' },
                    { name: 'Dorne', value: 'dorne' },
                    { name: 'Kuzey', value: 'kuzey' },
                    { name: 'Yaz Adaları', value: 'yazadalari' },
                    { name: 'Essos', value: 'essos' },
                    )
                    ),

    run: async (client, interaction) => {
        const nickname = interaction.options.getString('nickname');
        const cinsiyetKontrol = interaction.options.getString('cinsiyet');
        const sehirKontrol = interaction.options.getString('bolge');
        const soyDurumKontrol = interaction.options.getString('soy');
        const irkKontrol = interaction.options.getString('irk');
        const meslekKontrol = interaction.options.getString('meslek');
        const user = interaction.options.getUser('user')
        let soyDurum = ''
        let irk = ''
        let cinsiyet = ''
        let sehir = ''
        let meslek = ''
        const role = interaction.guild.roles.cache.get('1015197747344838706')
        if((interaction.member.id !== config.devOnly) && (interaction.member.roles.highest.position < role.position)) return await interaction.reply({content : "Bu komutu kullanmak için yeterli yetkin yok!", ephemeral :true})
        if(user.bot){
            return interaction.reply({content : "Etiketlediğin kullanıcı bir bot.", ephemeral: true})
        }
        switch(soyDurumKontrol){
            case 'soylu':
                soyDurum+="Soylu"
                break
            case 'pic':
                soyDurum+='Piç'
                break
            case 'koylu':
                soyDurum+="Köylü"
                break
        }

        switch(meslekKontrol){
            case 'pelerin':
                meslek+="Altın Pelerinler"
                break
            case 'muhafız':
                meslek+='Kral Muhafızları'
                break
            case 'korsan':
                meslek+="Korsanlar"
                break
            case 'haydut':
                meslek+="Haydutlar"
                break
            case 'paralı':
                meslek+="Paralı Asker"
                break
            case 'sovalye':
                meslek+="Şövalye"
                break
            case 'yaver':
                meslek+="Yaver"
                break
            case 'nedime':
                meslek+="Nedime/Hizmetçi"
                break
            case 'tuccar':
                meslek+="Tüccar"
                break
            case 'kral':
                meslek+="Kral"
                break
            case 'prens':
                meslek+="Prens/Prenses"
                break
            case 'lord':
                meslek+="Lord/Leydi"
                break
            case 'gece':
                meslek+="Gece Nöbetçisi"
                break
        }
        switch(cinsiyetKontrol){
            case 'kadin':
                cinsiyet+="Kadın"
                break
            case 'erkek':
                cinsiyet+="Erkek"
                break
        }

        switch(irkKontrol){
            case 'valy':
                irk+="Valyrialılar"
                break
            case 'ilkin':
                irk+="İlk İnsanlar"
                break
            case 'andal':
                irk+="Andallar"
                break
            case 'rhoy':
                irk+="Rhoynarlar"
                break
            case 'ess':
                irk+="Essoslu"
                break
        }

        switch(sehirKontrol){
            case 'tac':
                sehir+="Taç Toprakları"
                break
            case 'demira':
                sehir+="Demir Adalar"
                break
            case 'menzil':
                sehir+="Menzil"
                break
            case 'nehir':
                sehir+="Nehir Toprakları"
                break
            case 'firtina':
                sehir+="Fırtına Toprakları"
                break
            case 'vadi':
                sehir+="Vadi"
                break
            case 'bati':
                sehir+="Batı Toprakları"
                break
            case 'dorne':
                sehir+="Dorne"
                break
            case 'kuzey':
            sehir+="Kuzey"
            break
            case 'yazadalari':
                sehir+="Yaz Adaları"
                break
            case 'essos':
                sehir+="Essos"
                break
        }
        let nick = db.set(`profil.${user.id}.nickname`, nickname)
        let ds = db.set(`profil.${user.id}.ds`, 0)
        let gg = db.set(`profil.${user.id}.gg`, 0)
        let ae = db.set(`profil.${user.id}.ae`, 0)
        let cinsi = db.set(`profil.${user.id}.cinsiyet`, cinsiyet)
        let meslekk = db.set(`profil.${user.id}.meslek`, meslek)
        let ırk = db.set(`profil.${user.id}.irk`, irk)
        let soy = db.set(`profil.${user.id}.soy`, soyDurum)
        let bolge = db.set(`profil.${user.id}.bolge`, sehir)
        let bulundugu = db.set(`profil.${user.id}.bulundugubolge`, sehir)
        let seyahat = db.set(`profil.${user.id}.seyahat`, 0)
        let stat = db.set(`profil.${user.id}.stat`, 30)
        let ceviklik = db.set(`profil.${user.id}.ceviklik`, 0)
        let dayanıklılık = db.set(`profil.${user.id}.dayaniklilik`, 0)
        let güc = db.set(`profil.${user.id}.güc`, 0)
        let ticaret = db.set(`profil.${user.id}.ticaret`, 0)
        let dindarlık = db.set(`profil.${user.id}.dindarlik`, 0)
        let entrika = db.set(`profil.${user.id}.entrika`, 0)
        const embed = new Discord.EmbedBuilder()
            .setTitle(`Game Of Thrones | Kayıt Başarılı`)
            .setDescription(`${user} kaydedildi! Kaydedilen kullanıcının bilgileri aşağıda yer almaktadır.\n**Kullanıcı Adı :**  ${nick}\n**Kullanıcının Altın Ejderha Miktarı :** ${ae}\n**Kullanıcının Gümüş Geyik Miktarı :** ${gg}\n**Kullanıcının Demir Sikke Miktarı :** ${ds}\n**Kullanıcının Doğduğu Bölge :** ${bolge}\n**Kullanıcının Bulunduğu Bölge :** ${bulundugu}\n**Kullanıcının Cinsiyeti :** ${cinsi}\n**Kullanıcının Mesleği :** ${meslekk || "İşsiz"}\n**Kullanıcının Irkı :** ${ırk}\n**Kullanıcının Soy Durumu :** ${soyDurum}`)
            .setColor("000000")
            .setImage('https://media.giphy.com/media/UW1FgFobxIOntHhqNl/giphy-downsized-large.gif')
            .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.avatarURL({dynamic: true})}`})
            .setFooter({ text: `${config.Footer}`, iconURL: `${user.avatarURL({dynamic: true}) ? user.avatarURL({dynamic: true}) : client.user.avatarURL({dynamic: true})}`})
        await interaction.reply({embeds : [embed]});
    }
};
