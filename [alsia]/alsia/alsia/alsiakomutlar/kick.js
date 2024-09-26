const { MessageEmbed } = require('discord.js');
const moment = require('moment');
moment.locale('tr');

const config = require('../../ayarlar');

module.exports = {
    name: 'kick',
    description: 'Sunucudan oyuncuyu atar.',
    role: 'mod',
    options: [
        {
            name: 'ıᴅ',
            description: 'Oyuncunun ID\'sini giriniz.',
            required: true,
            type: 'STRING'
        },
        {
            name: 'sebep',
            description: 'Sunucudan kick sebebini giriniz.',
            required: true,
            type: 'STRING'
        }
    ],
    run: async (client, interaction, args) => {
        const playerId = args['ıᴅ'];
        const reason = args['sebep'];

        // Get player name from ID (you should replace this with your actual method to get player name)
        const playerName = GetPlayerName(playerId);
        if (!playerName) {
            return interaction.reply({
                content: '*Sunucuda bu ID\'ye ait herhangi biri bulunmamaktadır.*',
                ephemeral: true
            });
        }

        // Check if the command was executed in the correct channel
        if (interaction.channelId !== config.commandChannelId) {
            return interaction.reply({
                content: `*Hey merhaba bot komut işlemlerini sadece <#${config.commandChannelId}> kanalında yapabilirsin!*`,
                ephemeral: true
            });
        }

        // Create embed for the kick action
        const kickEmbed = new MessageEmbed()
            .setColor('#041f49')
            .setAuthor(interaction.guild.name, interaction.guild.iconURL({ dynamic: true }))
            .setDescription(`**${playerName} (${playerId})** sunucudan **${reason}** sebebiyle atıldı.`)
            .setFooter({ text: `Yetkili: ${interaction.user.tag}` });

        // Send embed to the command channel
        interaction.reply({ embeds: [kickEmbed] });

        // Log the action to a specified log channel
        const logEmbed = new MessageEmbed()
            .setColor('#041f49')
            .setTitle('IC LOG')
            .setDescription(`**Yetkili:** ${interaction.user.tag}\n**Tarih:** ${moment().format('DD.MM.YYYY HH:mm:ss')}\n**Oyuncu:** ${playerName} (${playerId})`)
            .setFooter({ text: 'ᴅᴇᴠ. ʙʏ ᴀʟꜱɪᴀ' });

        client.channels.cache.get(config.logChannelId).send({ embeds: [logEmbed] });

        // Drop the player from the server (you should replace this with your actual method to kick the player)
        DropPlayer(playerId, reason);
    }
};
