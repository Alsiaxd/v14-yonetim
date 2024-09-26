const { MessageEmbed } = require('discord.js');
const moment = require('moment');
moment.locale('tr');
const config = require('../../ayarlar');

module.exports = {
    name: 'özelmesaj',
    description: 'Oyuncuya özel olarak mesaj gönderirsiniz.',
    role: 'mod',
    options: [
        {
            name: 'ıᴅ',
            description: 'Gönderilecek oyuncunun ID\'sini giriniz.',
            required: true,
            type: 'INTEGER'
        },
        {
            name: 'mesaj',
            description: 'İleticiğiniz mesajı giriniz.',
            required: true,
            type: 'STRING'
        }
    ],
    run: async (client, interaction, options) => {
        const playerId = options['ıᴅ'];
        const messageContent = options['mesaj'];
        
        // Oyuncu ID kontrolü
        if (!GetPlayerName(playerId)) {
            return interaction.reply({
                content: '*Sunucuda bu ID\'ye ait herhangi biri bulunmamaktadır.*',
                ephemeral: true
            });
        }

        // Mesajı oyuncuya gönder
        client.utils.chatMessage(playerId, config.özelmesaj, messageContent, { color: [0xff, 0x0, 0x0] });

        // Komutun sadece belirli bir kanalda kullanılabileceğini kontrol et
        if (interaction.channel.id !== config.BotKomut) {
            return interaction.reply({
                content: `*${interaction.member}, hey merhaba, bot komut işlemlerini sadece <#${config.BotKomut}> kanalında yapabilirsin!*`,
                ephemeral: true
            });
        }

        // Embed mesaj oluştur
        const playerEmbed = new MessageEmbed()
            .setTitle('Özel Mesaj Gönderildi')
            .setThumbnail(interaction.member.user.avatarURL({ dynamic: true }))
            .setDescription(`**${GetPlayerName(playerId)} (${playerId})**\n${messageContent}`)
            .setColor('#44hMwVgH')
            .setFooter({ text: 'Dev. by alsia' });

        interaction.reply({ embeds: [playerEmbed] });

        // IC Log Embed oluştur
        const logEmbed = new MessageEmbed()
            .setColor('#44hMwVgH')
            .setTitle('IC Log')
            .setFooter({ text: 'Özel Mesaj Gönderildi' })
            .setDescription(`**Mesaj Gönderen:** ${interaction.member}\n**Oyuncu:** ${GetPlayerName(playerId)} (${playerId})\n**Tarih:** ${moment().format('LLL')}`)
            .setThumbnail(interaction.member.user.avatarURL({ dynamic: true }));

        client.channels.cache.get(config.IcLog).send({ embeds: [logEmbed] });
    }
};
