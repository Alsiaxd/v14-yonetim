const { Permissions, MessageEmbed } = require('discord.js');
const moment = require('moment');
moment.locale('tr');

module.exports = {
    name: 'para',
    description: 'Oyuncunun para miktarını ayarlarsınız.',
    role: 'admin',
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'ekle',
            description: 'Oyuncuya para ekler',
            options: [
                {
                    name: 'ıd',
                    description: 'Oyuncu ID\'sini giriniz.',
                    required: true,
                    type: 'INTEGER'
                },
                {
                    name: 'tür',
                    description: 'Para türünü seçiniz.',
                    required: true,
                    type: 'STRING',
                    choices: [
                        { name: 'NAKIT', value: 'cash' },
                        { name: 'BANKA', value: 'bank' }
                    ]
                },
                {
                    name: 'miktar',
                    description: 'Para miktarını giriniz.',
                    required: true,
                    type: 'INTEGER'
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'çıkar',
            description: 'Oyuncudan para çıkarır',
            options: [
                {
                    name: 'ıd',
                    description: 'Oyuncu ID\'sini giriniz.',
                    required: true,
                    type: 'INTEGER'
                },
                {
                    name: 'tür',
                    description: 'Para türünü seçiniz.',
                    required: true,
                    type: 'STRING',
                    choices: [
                        { name: 'NAKİT', value: 'cash' },
                        { name: 'BANKA', value: 'bank' }
                    ]
                },
                {
                    name: 'miktar',
                    description: 'Para miktarını giriniz.',
                    required: true,
                    type: 'INTEGER'
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'görüntüle',
            description: 'Oyuncunun para bilgilerini görüntüler',
            options: [
                {
                    name: 'ıd',
                    description: 'Oyuncu ID\'sini giriniz.',
                    required: true,
                    type: 'INTEGER'
                }
            ]
        }
    ],
    run: async (client, interaction, args) => {
        const id = args['ıd'];
        const tür = args['tür'];
        const miktar = args['miktar'];
        const player = await client.QBCore.Functions.GetPlayer(id);

        if (!player) {
            return interaction.reply({ content: 'Bu ID\'ye ait oyuncu bulunamadı.', ephemeral: true });
        }

        if (interaction.commandName === 'ekle') {
            if (player.Functions.AddMoney(tür, miktar)) {
                const embed = new MessageEmbed()
                    .setColor('#041f49')
                    .setAuthor({ name: 'Para Ekleme' })
                    .setDescription(`Oyuncuya başarıyla ${miktar} ${tür} eklendi.`)
                    .setFooter({ text: `ID: ${id}` })
                    .setThumbnail(interaction.member.avatarURL({ dynamic: true }));

                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply({ content: 'Oyuncuya para eklenemedi.', ephemeral: true });
            }
        }

        if (interaction.commandName === 'çıkar') {
            if (player.Functions.RemoveMoney(tür, miktar)) {
                const embed = new MessageEmbed()
                    .setColor('#041f49')
                    .setAuthor({ name: 'Para Çıkarma' })
                    .setDescription(`Oyuncudan başarıyla ${miktar} ${tür} çıkarıldı.`)
                    .setFooter({ text: `ID: ${id}` })
                    .setThumbnail(interaction.member.avatarURL({ dynamic: true }));

                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply({ content: 'Oyuncudan para çıkarılamadı.', ephemeral: true });
            }
        }

        if (interaction.commandName === 'görüntüle') {
            const moneyInfo = player.Functions.GetMoneyInfo();
            const embed = new MessageEmbed()
                .setColor('#041f49')
                .setAuthor({ name: 'Para Bilgileri' })
                .setDescription(`Oyuncunun para bilgileri:\n${moneyInfo}`)
                .setFooter({ text: `ID: ${id}` })
                .setThumbnail(interaction.member.avatarURL({ dynamic: true }));

            await interaction.reply({ embeds: [embed] });
        }
    }
};
