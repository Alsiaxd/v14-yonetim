const { MessageEmbed } = require('discord.js');
const moment = require('moment');
moment.locale('tr');
const config = require('../../ayarlar');

module.exports = {
    name: 'ışınla',
    description: 'Belirttiğiniz mekana oyuncuyu götürür.',
    role: 'mod',
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'teleport',
            description: 'Oyuncuyu belirttiğiniz mekana götürür.',
            options: [
                {
                    name: 'ıᴅ',
                    description: 'Oyuncunun ID\'sini giriniz.',
                    required: true,
                    type: 'INTEGER'
                },
                {
                    name: 'mekan',
                    description: 'Belirlediğiniz yere oyuncuyu götürür.',
                    required: true,
                    type: 'STRING',
                    choices: [
                        { name: '🚓 | Polis Departmanı', value: 'pd' },
                        { name: '🕌 | Maze Bank', value: 'mazeroof' },
                        { name: '💺 | Garaj', value: 'garaj' },
                        { name: '⛺️ | Motel', value: 'motel' },
                        { name: '🚑 | Hastane', value: 'ems' },
                        { name: '🛸 | Çekilmişler', value: 'cekilmis' },
                        { name: '🚨 | Sheriff Departmanı', value: 'sd' }
                    ]
                },
                {
                    name: 'is_veh',
                    description: 'Oyuncu araç içinde mi?',
                    required: true,
                    type: 'BOOLEAN'
                }
            ]
        }
    ],
    run: async (client, interaction, options) => {
        const teleportLocations = {
            cekilmis: [-220.25, -1176.63, 23.028],
            mazerof: [-75.57, -818.88, 327.96],
            pd: [633.8693, 14.08704, 84.335],
            garaj: [261.5852, -305.861, 49.645],
            motel: [452.55319213867, 268.71463012695, 103.20748901367],
            sd: [1818.98, 3737.984, 33.502],
            ems: [172.0466, -559.601, 43.872]
        };

        const playerId = options['ıᴅ'];
        const location = options['mekan'];
        const isVehicle = options['is_veh'];

        if (!GetPlayerName(playerId)) {
            return interaction.reply({ content: '*Sunucuda bu ID\'ye ait herhangi biri bulunmamaktadır.*', ephemeral: true });
        }

        if (interaction.user.id !== config.BotKomut) {
            return interaction.reply({ content: `*${interaction.user.username} komutları sadece yetkili kişiler kullanabilir!*`, ephemeral: true });
        }

        teleport(playerId, teleportLocations[location][0], teleportLocations[location][1], teleportLocations[location][2], isVehicle);

        const embed = new MessageEmbed()
            .setColor('#041f49')
            .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
            .setDescription(`*İsimli oyuncu başarılı bir şekilde ${location} konumuna ışınlandı.*`)
            .setFooter({ text: `${config.EmbedYazı} - IC LOG`, iconURL: interaction.guild.iconURL({ dynamic: true }) });

        interaction.reply({ embeds: [embed] });

        const logEmbed = new MessageEmbed()
            .setColor('#041f49')
            .setTitle(`${config.EmbedYazıNormal} - IC LOG`)
            .setFooter({ text: 'ᴅᴇᴠ. ʙʏ ᴀʟꜱɪᴀ' })
            .setDescription(`\n<:king_crown:1233294287282765865> ・ \`YETKILI:\` ${interaction.user.username} (${interaction.user.id})\n<:animated_clock29:1037628438233743360> ・ \`TARIH:\` ${moment().format('LLL')}\n\n<:a_bug_cat_computer_slam_work:1037747413747761213> ・ \`MEKAN:\` ${location}\n`)
            .setThumbnail(interaction.user.avatarURL({ dynamic: true }));

        client.channels.cache.get(config.IcLog).send({ embeds: [logEmbed] });
    }
};

function teleport(playerId, x, y, z, isVehicle = false) {
    x = x.toFixed(2);
    y = y.toFixed(2);
    z = z.toFixed(2);

    if (NetworkGetEntityOwner(GetPlayerPed(playerId)) === playerId) {
        emitNet(`${GetCurrentResourceName()}:teleport`, playerId, x, y, z, isVehicle);
    } else {
        SetEntityCoords(GetPlayerPed(playerId), x, y, z);
    }
}
