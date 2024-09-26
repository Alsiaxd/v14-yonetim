const { Permissions, MessageEmbed, MessageButton } = require('discord.js');
const moment = require('moment');
moment.locale('tr');

const config = require('../../ayarlar');

module.exports = {
    name: 'oyuncular',
    description: 'Sunucudaki oyuncuları gösterir.',
    role: 'mod',
    run: async (interaction, client) => {
        // Yetki kontrolü
        if (interaction.channel.id !== config.BotKomut) {
            return interaction.reply({
                content: `*${interaction.member} komutları sadece <#${config.BotKomut}> kanalında kullanabilirsiniz!*`,
                ephemeral: true
            });
        }

        // Oyuncu sayısını kontrol et
        if (GetNumPlayerIndices() === 0) {
            return interaction.reply({
                content: '*Sunucuda Kimse Bulunmamaktadır.*',
                ephemeral: false
            });
        }

        // Oyuncu listesini oluştur
        const playerList = [];
        let pageIndex = 0;

        getPlayers().forEach((playerId, index) => {
            const page = Math.floor(index / 10);
            if (!playerList[page]) playerList[page] = '';
            playerList[page] += `${index + 1}. ${GetPlayerName(playerId)} (${playerId})\n`;

            // QBCore ile ek bilgi alma
            if (client.QBCore) {
                try {
                    const playerData = client.QBCore.Functions.GetPlayer(parseInt(playerId));
                    playerList[page] += `\nCitizen ID: ${playerData.PlayerData.citizenid}\nName: ${playerData.PlayerData.name}\n`;
                } catch {
                    playerList[page] += ' (Yüklenemiyor!)\n';
                }
            }
        });

        // Embed oluştur
        const embeds = playerList.map(page => {
            return new MessageEmbed()
                .setTitle(`${config.EmbedYazı} - Oyuncular (${GetNumPlayerIndices()})`)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setColor('#32025d')
                .setDescription(page);
        });

        // Butonları oluştur
        const previousButton = new MessageButton()
            .setCustomId('previousbtn')
            .setLabel('🔺')
            .setStyle('SECONDARY');

        const nextButton = new MessageButton()
            .setCustomId('nextbtn')
            .setLabel('🔻')
            .setStyle('SECONDARY');

        // Embed mesajı gönder
        interaction.paginationEmbed(client, embeds, [previousButton, nextButton]);
    }
};
