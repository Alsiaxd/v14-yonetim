const {
    Permissions,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu
} = require('discord.js'),
moment = require('moment'),
config = require('../../ayarlar');

moment.locale('tr');

module.exports = {
    'name': 'charinfo',
    'description': 'ID\'sini Girdiğiniz Oyuncunun Bütün Bilgilerini Alırsınız.',
    'role': 'citizenid',
    'options': [
        {
            'name': 'ıᴅ',
            'description': 'Oyuncunun ID\'sini giriniz.',
            'required': true,
            'type': 'STRING'
        }
    ],
    'run': async (client, interaction, args) => {
        if (interaction.channelId !== config.BotKomut) {
            return interaction.reply({
                'content': '*' + interaction.member + ', Hey merhaba bot komut işlemlerini sadece <#1277374104420352064> kanalında yapabilirsin!*',
                'ephemeral': true
            }).catch(() => {});
        }

        const playerDiscordId = args['ıᴅ'];
        const player = await client.utils.getPlayerFromDiscordId(playerDiscordId);

        if (!player) {
            return interaction.reply({
                'content': '<@' + playerDiscordId + '> *İsimli oyuncu oyunda değil*',
                'ephemeral': true
            });
        }

        const playerData = client.QBCore.Functions.GetPlayer(parseInt(player));
        if (!playerData) {
            return interaction.reply({
                'content': '<@' + playerDiscordId + '> *İsimli oyuncu oyunda değil.*',
                'ephemeral': true
            });
        }

        const embed = new MessageEmbed()
            .setColor('#041f49')
            .setThumbnail(interaction.member.user.avatarURL({ 'dynamic': true }))
            .setDescription(
                `**ID:** ${playerDiscordId} *isimli oyuncu oyunda aktif ve bilgileri;*` +
                `\n\n» **İç İsim:** ${playerData.PlayerData.charinfo.firstname} ${playerData.PlayerData.charinfo.lastname}` +
                `\n» **Citizen ID:** ${playerData.PlayerData.citizenid}` +
                `\n» **Hex ID:** ${playerData.PlayerData.cid}`
            )
            .setAuthor({
                'name': config.EmbedYazı + ' - DC Kontrol',
                'iconURL': interaction.guild.iconURL({ 'dynamic': true })
            });

        interaction.reply({ 'embeds': [embed] });

        return interaction.reply({
            'content': `<@${playerDiscordId}> *isimli oyuncu oyunda ve bilgileri* ${playerData.PlayerData.charinfo.firstname} ${playerData.PlayerData.charinfo.lastname} (${playerData.PlayerData.citizenid}) (${playerData.PlayerData.id})`,
            'ephemeral': true
        });
    }
};
