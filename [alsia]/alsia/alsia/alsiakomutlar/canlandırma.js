const { Permissions, MessageEmbed } = require('discord.js');
const moment = require('moment');
moment.locale('tr');

const config = require('../../ayarlar');

module.exports = {
    name: 'Revive',
    description: 'Canlandırma komutu',
    role: 'mod',
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

        // ID'yi kontrol et
        if (!GetPlayerName(playerId)) {
            return interaction.reply({
                content: '*Sunucuda bu ID\'ye ait herhangi biri bulunmamaktadır.*',
                ephemeral: true
            });
        }

        // İzin verilen kanal olup olmadığını kontrol et
        if (interaction.channelId !== config.channelId) {
            return interaction.reply({
                content: '*Bu komutu sadece belirli bir kanalda kullanabilirsiniz!*',
                ephemeral: true
            });
        }

        // Canlandırma işlemini başlat
        emitNet(config.reviveEvent, playerId);

        // Başarı mesajını oluştur
        const successEmbed = new MessageEmbed()
            .setColor('#041f49')
            .setThumbnail(interaction.member.user.avatarURL({ dynamic: true }))
            .setDescription(
                `<a:5961darkbluetea:1233795662949388380> ・ \`YETKİLİ:\` ${interaction.member}\n` +
                `\n` +
                `<:8676gasp:1233279834600378441> ・ \`OYUNCU:\` ${GetPlayerName(playerId)} - (${playerId})`
            )
            .setAuthor({
                name: `${config.botName} - Revive`,
                iconURL: interaction.guild.iconURL({ dynamic: true })
            });

        await interaction.reply({ embeds: [successEmbed] });

        // IC Log mesajını oluştur
        const logEmbed = new MessageEmbed()
            .setColor('#041f49')
            .setTitle(`${config.icLogName} - IC LOG`)
            .setFooter({ text: 'DEV. BY ALSİA' })
            .setDescription(
                `**Kullanıcı:** ${interaction.member}\n` +
                `**Oyuncu:** ${GetPlayerName(playerId)}\n` +
                `**ID:** ${playerId}\n` +
                `**Tarih:** ${moment().format('DD.MM.YYYY HH:mm:ss')}`
            )
            .setThumbnail(interaction.member.user.avatarURL({ dynamic: true }));

        client.channels.cache.get(config.logChannelId).send({ embeds: [logEmbed] });
    }
};
