const { Permissions, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const moment = require("moment")
moment.locale("tr")
const config = require('../../ayarlar');


const mysql = require('mysql');
var sql = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "qbcorerw"
});

module.exports = {
    name: "ck",
    description: "ID'sini Girdiğiniz Oyuncunun Bütün Bilgilerini Silersiniz.",
    role: "full",

    options: [
        {
            name: "ıᴅ",
            description: "Oyuncunun ID'sini giriniz.",
            required: true,
            type: "INTEGER",
        },
    ],

    run: async (client, interaction, args) => {
        if (!GetPlayerName(args.ıᴅ
)) return interaction.reply({ content: "*Sunucuda bu ID'ye ait herhangi biri bulunmamaktadır.*", ephemeral: true });
   
   
   
        if (interaction.channelId !== config.BotKomut) return interaction.reply({content: `*${interaction.member}, Hey merhaba bot komut işlemlerini sadece <#1277374104420352064> kanalında yapabilirsin!*` , ephemeral: true}).catch(() => {});
        const sebeps = client.utils.replaceGlobals(client, `» Karakterinize CK atıldı! \n\n Yetkili: ${interaction.member.user.username} \n Tarih: ${moment(Date.now()).format("LLL")}`);


        const qbplayer = client.QBCore.Functions.GetPlayer(parseInt(args.ıᴅ));
        if (!qbplayer) return interaction.reply({ content: `<@${args.ıᴅ}> *İsimli oyuncu oyunda değil*`, ephemeral: true });
       
   
        const citizenid = qbplayer.PlayerData.citizenid


        const embed = new MessageEmbed()
        .setColor('#041f49')
        .setThumbnail(interaction.member.user.avatarURL({dynamic:true}))
        .setDescription(`<a:utility:1233294337048051794> ・ \`${GetPlayerName(args.ıᴅ)} - (${args.ıᴅ})\` *isimli oyuncuya CK atıldı*

        <a:5961darkbluetea:1037418919566266408> ・ \`ʏᴇᴛᴋıʟı:\` ${interaction.member}`)
        .setAuthor({
          name: `${config.EmbedYazı} - ᴄᴋ`, 
          iconURL: interaction.guild.iconURL({dynamic: true})})
        interaction.reply({embeds: [embed]})


        const embedss = new MessageEmbed()
        .setColor('#041f49')
        .setAuthor({
          name:`${config.EmbedYazıNormal} - IC LOG`, 
        })
        .setFooter({ text: "ᴅᴇᴠ. ʙʏ ᴀʟꜱɪᴀ" })
        .setDescription(`
        <:king_crown:1233294287282765865> ・ \`ʏᴇᴛᴋɪʟɪ:\` ${interaction.member}
        <:8676gasp:1233279834600378441> ・ \`ᴏʏᴜɴᴄᴜ: ${GetPlayerName(args.ıᴅ)} - (${citizenid})\`

       <a:5961darkbluetea:1233795662949388380> ・ \`ʏᴀᴘɪʟᴀɴ ɪꜱʟᴇᴍ: ᴋᴀʀᴀᴋᴛᴇʀ ꜱıꜰıʀʟᴀᴍᴀ\`
        <a:mcsaat:1233283897660411964> ・ \`ᴛᴀʀıʜ: ${moment(Date.now()).format("LLL")}\`
`)
       
        .setThumbnail(interaction.member.user.avatarURL({dynamic:true}))
   client.channels.cache.get(config.IcLog).send({embeds: [embedss]})



   await sql.query("DELETE FROM players WHERE citizenid = ?", citizenid , (err,results,fields) => {  if (err) return console.error(error.message);})




DropPlayer(args.ıᴅ
, sebeps); 














    },
};
