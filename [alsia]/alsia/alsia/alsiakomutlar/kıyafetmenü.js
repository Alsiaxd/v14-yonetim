const { MessageEmbed } = require('discord.js');
const moment = require('moment');
moment.locale('tr');

const config = require('../../ayarlar');

module.exports = {
    name: 'kıyafet',
    description: 'Oyuncuya kıyafet menüsü verirsiniz.',
    role: 'mod',
    options: [
        {
            name: 'ıᴅ',
            description: 'Oyuncu ID\'sini giriniz.',
            required: true,
            type: 'INTEGER'
        }
    ],
    run: async (client, interaction, args) => {
        const playerId = args['ıᴅ'];

        // Get player name from ID (you should replace this with your actual method to get player name)
        const playerName = GetPlayerName(playerId);
        if (!playerName) {
            return interaction.reply({
                content: '*Sunucuda bu ID\'ye ait herhangi biri bulunmamaktadır.*',
                ephemeral: true
            });
        }

        // Emit net event for the clothing menu (replace with your actual method)
        emitNet(config.clothingMenuEvent, playerId);

        // Check if the command was executed in the correct channel
        if (interaction.channelId !== config.commandChannelId) {
            return interaction.reply({
                content: `*Hey merhaba bot komut işlemlerini sadece <#${config.commandChannelId}> kanalında yapabilirsin!*`,
                ephemeral: true
            });
        }

        // Create embed for the clothing menu action
        const actionEmbed = new MessageEmbed()
            .setColor('#041f49')
            .setAuthor(interaction.user.tag, interaction.user.avatarURL({ dynamic: true }))
            .setDescription(`**${playerName} (${playerId})** isimli oyuncuya kıyafet menüsü verildi.`)
            .setFooter({ text: `Yetkili: ${interaction.user.tag}` });

        // Send embed to the command channel
        interaction.reply({ embeds: [actionEmbed] });

        // Create embed for logging the action
        const logEmbed = new MessageEmbed()
            .setColor('#041f49')
            .setTitle(`${config.embedTitle} - IC LOG`)
            .setFooter({ text: 'ᴅᴇᴠ. ʙʏ ᴀʟꜱɪᴀ' })
            .setDescription(`**Yetkili:** ${interaction.user.tag}\n**Tarih:** ${moment().format('DD.MM.YYYY HH:mm:ss')}\n**Oyuncu:** ${playerName} (${playerId})`);

        // Send log embed to the specified log channel
        client.channels.cache.get(config.logChannelId).send({ embeds: [logEmbed] });
    }
};
