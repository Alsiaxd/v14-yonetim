const { Permissions, MessageEmbed } = require('discord.js');
const moment = require('moment');
moment.locale('tr');
const config = require('../../ayarlar');

module.exports = {
    name: 'playerinfo',
    description: 'ID\'sini girdiğiniz oyuncunun bütün bilgilerini alırsınız.',
    role: 'BotKomut',
    options: [
        {
            name: 'ıᴅ',
            description: 'Oyuncunun ID\'sini giriniz.',
            required: true,
            type: 'INTEGER'
        }
    ],
    run: async (client, interaction, args) => {
        const playerId = args['ıᴅ'];

        // Oyuncu bulunup bulunmadığını kontrol et
        if (!GetPlayerName(playerId)) {
            return interaction.reply({
                content: '*Sunucuda bu ID\'ye ait herhangi biri bulunmamaktadır.*',
                ephemeral: true
            });
        }

        // Yetkileri kontrol et
        if (interaction.guild.id !== config['BotKomut']) {
            return interaction.reply({
                content: `*${interaction.user.tag} bu komutu sadece belirli bir kanalda kullanabilir!*`,
                ephemeral: true
            });
        }

        // Oyuncu bilgilerini al
        let playerInfo = '';
        for (const [type, value] of Object.entries(client.players.getPlayerIdentifiers(playerId))) {
            if (type === 'discord') {
                playerInfo += `**${type}:** <@${value}> (${value})\n`;
            } else {
                playerInfo += `**${type}:** ${value}\n`;
            }
        }

        // Bilgi embed'ini oluştur
        const embed = new MessageEmbed()
            .setColor('#041f49')
            .setTitle(`Oyuncu Bilgileri: ${GetPlayerName(playerId)} (${playerId})`)
            .setDescription(`${playerInfo}\n<a:5961darkbluetea:1233795662949388380> ・ \`YETKİLİ:\` ${interaction.member}`)
            .setAuthor({
                name: `${config['BotName']} - Oyuncu Bilgileri`,
                iconURL: interaction.guild.iconURL({ dynamic: true })
            });

        await interaction.reply({ embeds: [embed] });

        // İkinci embed oluştur ve gönder
        const footerEmbed = new MessageEmbed()
            .setColor('#041f49')
            .setTitle(`${config['BotName']} - Bilgi`)
            .setFooter({ text: 'Bilgi tarihi:' })
            .setDescription(`*Komutu kullanan: ${interaction.user.tag}*\nOyuncu: ${GetPlayerName(playerId)} (${playerId})\nTarih: ${moment(Date.now()).format('LLL')}`)
            .setThumbnail(interaction.user.avatarURL({ dynamic: true }));

        client.channels.cache.get(config['infoChannelId']).send({ embeds: [footerEmbed] });
    }
};
