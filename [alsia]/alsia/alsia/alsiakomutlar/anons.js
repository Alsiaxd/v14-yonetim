const { Permissions, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const moment = require('moment');
const config = require('../../ayarlar');

moment.locale('tr');

module.exports = {
    name: 'duyuru',
    description: 'Sunucuya Genel Bir Duyuru Yapar.',
    role: 'admin',
    options: [
        {
            name: 'yazı',
            description: 'atılacak yazıyı yazınız lütfen.',
            required: true,
            type: 'STRING'
        }
    ],
    run: async (client, interaction, args) => {
        const duyuruYazisi = args.yazı;

        client.utils.chatMessage(-1, config.channelId, duyuruYazisi, { color: [255, 0, 0] });

        if (interaction.member.user.id !== config.admin) {
            return interaction.reply({
                content: `*${interaction.member}, Hey merhaba bot komut işlemlerini sadece <#1277374104420352064> kanalında yapabilirsin!*`,
                ephemeral: true
            }).catch(() => {});
        }

        const duyuruEmbed = new MessageEmbed()
            .setColor('#041f49')
            .setAuthor('Anons', interaction.guild.iconURL({ dynamic: true }))
            .setDescription(`<a:utility:1233294337048051794> ・ *Başarılı bir şekilde sunucuya* \`${duyuruYazisi}\` *içerikli anonsunuz gönderildi.*\n\n <a:5961darkbluetea:1037418919566266408> ・ \`YETKİLİ:\` ${interaction.member}`)
            .setFooter('ᴅᴇᴠ. ʙʏ ᴀʟꜱɪᴀ', interaction.guild.iconURL({ dynamic: true }));

        interaction.reply({ embeds: [duyuruEmbed] });

        const logEmbed = new MessageEmbed()
            .setColor('#041f49')
            .setFooter({ text: 'ᴅᴇᴠ. ʙʏ ᴀʟꜱɪᴀ' })
            .setDescription(`
                <a:unlemsel:1233294336184160327> ・ \`YAPILAN İŞLEM: SUNUCU ANONSU\`\n
                <a:mcsaat:1233283897660411964> ・ \`TARİH: ${moment(Date.now()).format('LLL')}\`\n
                <a:5961darkbluetea:1233795662949388380> ・ \`İÇERİK:\` ${duyuruYazisi}
            `)
            .setAuthor(`${config.EmbedYazıNormal} - IC LOG`, interaction.guild.iconURL({ dynamic: true }));

        client.channels.cache.get(config.IcLog).send({ embeds: [logEmbed] });
    }
};
