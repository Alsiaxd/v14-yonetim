const { Permissions, MessageEmbed } = require('discord.js');
const moment = require('moment');
moment.locale('tr');

const config = require('../../ayarlar');

module.exports = {
    name: 'öldür',
    description: 'Sunucuda bir oyuncuyu öldürürsünüz.',
    role: 'mod',
    options: [
        {
            name: 'ıᴅ',
            description: 'Oyuncu ID\'sini giriniz lütfen.',
            required: true,
            type: 'INTEGER'
        }
    ],
    run: async (interaction, client, args) => {
        const playerId = args['ıᴅ'];

        // Oyuncu var mı kontrolü
        if (!GetPlayerName(playerId)) {
            return interaction.reply({
                content: '*Sunucuda bu ID\'ye ait herhangi biri bulunmamaktadır.*',
                ephemeral: true
            });
        }

        // Oyuncuyu öldürme işlemi
        emitNet(`${GetCurrentResourceName()}:kill`, playerId);

        // Bot komut kontrolü
        if (interaction.channel.id !== config.BotKomut) {
            return interaction.reply({
                content: `*${interaction.member} sadece <#${config.BotKomut}> kanalında bu komutları kullanabilirsiniz!*`,
                ephemeral: true
            });
        }

        // Başarılı işlem mesajı
        const successEmbed = new MessageEmbed()
            .setColor('#041f49')
            .setAuthor({
                name: `${config.EmbedYazı} - IC LOG`,
                iconURL: interaction.member.user.avatarURL({ dynamic: true })
            })
            .setDescription(
                `\n\n<a:5961darkbluetea:1233795662949388380> ・ \`yetkili: ${interaction.member}\`\n` +
                `\n<a:5961darkbluetea:1233795662949388380>・ \`oyuncu: ${GetPlayerName(playerId)} (${playerId})\`\n` +
                `\n<a:utility:1233294337048051794> ・ \`yapılan işlem: öldürme\`\n` +
                `\n<a:mcsaat:1233283897660411964> ・ \`tarih: ${moment(Date.now()).format('LLL')}\`\n`
            );

        // Kanalda mesaj gönderme
        await interaction.reply({ embeds: [successEmbed] });

        // Log mesajı
        const logEmbed = new MessageEmbed()
            .setColor('#041f49')
            .setTitle(`${config.EmbedYazıNormal} - IC LOG`)
            .setDescription(
                `\n\n<:king_crown:1233294287282765865> ・ \`yetkili: ${interaction.member}\`\n` +
                `\n<:king_crown:1233294287282765865>・ \`oyuncu: ${GetPlayerName(playerId)} (${playerId})\`\n` +
                `\n<:<:king_crown:1233294287282765865>> ・ \`yapılan işlem: öldürme\`\n` +
                `\n<:king_crown:1233294287282765865>・ \`tarih: ${moment(Date.now()).format('LLL')}\`\n`
            )
            .setFooter({ text: 'ᴅᴇᴠ. ʙʏ ᴀʟꜱɪᴀ' });

        // Log kanalına mesaj gönderme
        client.channels.cache.get(config.channelId).send({ embeds: [logEmbed] });
    }
};
