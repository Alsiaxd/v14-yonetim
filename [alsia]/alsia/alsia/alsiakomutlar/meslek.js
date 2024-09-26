const { Permissions, MessageEmbed } = require('discord.js');
const moment = require('moment');
moment.locale('tr');

const config = require('../../ayarlar');

module.exports = {
    name: 'meslek',
    description: 'Oyuncunun meslek işlemlerini yaparsınız.',
    role: 'mod',
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'ver',
            description: 'Meslek vermenize işe yarar.',
            options: [
                {
                    name: 'ıᴅ',
                    description: 'Oyuncunun ID\'sini giriniz.',
                    required: true,
                    type: 'INTEGER'
                },
                {
                    name: 'meslek',
                    description: 'Lütfen vericeğiniz mesleğin değerini giriniz.',
                    required: true,
                    type: 'STRING',
                    choices: [
                        { name: 'Seviye 0', value: '0' },
                        { name: 'Seviye 1', value: '1' },
                        // Diğer seviyeleri buraya ekleyin...
                        { name: 'Seviye 20', value: '20' }
                    ]
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'kontrol',
            description: 'Oyuncunun mesleğini kontrol edersiniz.',
            options: [
                {
                    name: 'ıᴅ',
                    description: 'Oyuncunun ID\'sini giriniz.',
                    required: true,
                    type: 'INTEGER'
                }
            ]
        }
    ],
    run: async (client, interaction, args) => {
        const playerId = args['ıᴅ'];
        const playerName = GetPlayerName(playerId);
        if (!playerName) {
            return interaction.reply({ content: '*Sunucuda bu ID\'ye ait herhangi biri bulunmamaktadır.*', ephemeral: true });
        }

        const playerData = client.QBCore.PlayerData.Get(playerId);
        const jobName = playerData.job.name;
        const jobLevel = playerData.job.grade;

        if (args['ᴠᴇʀ']) {
            const jobSet = client.QBCore.PlayerData.SetJob(playerId, args['meslek'], args['ᴅᴇɢᴇʀ']);
            if (jobSet) {
                const embed = new MessageEmbed()
                    .setColor('#041f49')
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(`**${GetPlayerName(playerId)}** (${playerId}) mesleği **${jobName}** olarak güncellenmiştir. Yeni seviye: **${args['ᴅᴇɢᴇʀ']}**`)
                    .setFooter({ text: `${config.EmbedYazı} • IC LOG`, iconURL: interaction.guild.iconURL({ dynamic: true }) });

                interaction.reply({ embeds: [embed] });

                const logEmbed = new MessageEmbed()
                    .setColor('#041f49')
                    .setTitle(`${config.EmbedYazıNormal} • İşlem Detayı`)
                    .setDescription(`
                        <:king_crown:1233294287282765865> • \`YETKİLİ:\` ${interaction.member}
                        <a:5961darkbluetea:1233795662949388380> • \`YAPILAN İŞLEM:\` Meslek
                        <a:mcsaat:1233283897660411964> • \`TARIH:\` ${moment().format('LLL')}
                        <a:duyuru:1233294262049964043> • \`DEĞER:\` ${args['ᴅᴇɢᴇʀ']}
                    `)
                    .setFooter({ text: `${config.EmbedYazı} • IC LOG`, iconURL: interaction.guild.iconURL({ dynamic: true }) });

                client.channels.cache.get(config.logChannel).send({ embeds: [logEmbed] });
            } else {
                return interaction.reply({ content: '*Meslek ayarı başarısız oldu.*', ephemeral: false });
            }
        } else if (args['ᴋᴏɴᴛʀᴏʟ']) {
            const embed = new MessageEmbed()
                .setColor('#041f49')
                .setTitle('Meslek Bilgisi')
                .setDescription(`**${GetPlayerName(playerId)}** (${playerId}) mesleği: \`${jobName}\``)
                .setFooter({ text: `${config.EmbedYazı} • IC LOG`, iconURL: interaction.guild.iconURL({ dynamic: true }) });

            interaction.reply({ embeds: [embed] });
        }
    }
};

function GetPlayerName(id) {
    // Bu fonksiyon oyuncu adını döndürmelidir.
    // Implementasyon detayları eksik.
    return 'Oyuncu Adı'; // Örnek dönüş
}
