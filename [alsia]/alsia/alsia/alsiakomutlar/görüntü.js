const fs = require('fs').promises;
const Buffer = require('buffer').Buffer;
const { Permissions, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const moment = require('moment');
moment.locale('tr');

const config = require('../../ayarlar');

module.exports = {
    name: 'screenshot',
    description: 'Oyuncunun anlık ekran görüntüsünü alır.',
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
        if (!GetPlayerName(args['ıᴍ'])) {
            return interaction.reply({ content: '*Sunucuda bu ID\'ye ait herhangi biri bulunmamaktadır.*', ephemeral: true });
        }

        if (interaction.guild.id !== config['guildId']) {
            return interaction.reply({ content: '*Bu komutu sadece belirtilen kanalda kullanabilirsiniz!*', ephemeral: true });
        }

        if (GetResourceState('screenshot-basic') !== 'started') {
            return interaction.reply({ content: 'Ekran görüntüsü alınamıyor.', ephemeral: false });
        }

        await interaction.reply('Ekran görüntüsü alınmaya başlandı..');

        const fileName = `screenshot_${args['ıᴍ']}.jpg`;
        try {
            const screenshotBase64 = await takeScreenshot(args['ıᴍ']);
            const screenshotBuffer = Buffer.from(screenshotBase64, 'base64');
            const embed = new MessageEmbed()
                .setTitle(`Oyuncunun Görüntüsü:`)
                .setImage('attachment://screenshot.jpg')
                .setFooter(`Kaydedilme Zamanı: ${moment(Date.now()).format('LLL')}`)
                .setColor('#3a0092');

            await interaction.editReply({
                content: null,
                embeds: [embed],
                files: [{ attachment: screenshotBuffer, name: fileName }]
            });

            if (config['saveScreenshots']) {
                await fs.mkdir('screenshots', { recursive: true });
                await fs.writeFile(`screenshots/${fileName}`, screenshotBase64, { encoding: 'base64', flag: 'w+' });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('**Ekran görüntüsünde hata oluştu.**');
        }
    }
};

const takeScreenshot = async (playerId) => {
    return new Promise((resolve, reject) => {
        global.exports['screenshot-basic'].requestClientScreenshot(playerId, {}, (error, screenshot) => {
            if (error) {
                return reject(error);
            }
            resolve(screenshot.split(';base64,')[1]);
        });
    });
};
