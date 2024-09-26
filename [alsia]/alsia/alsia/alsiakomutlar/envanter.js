const { Permissions, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const moment = require('moment');
moment.locale('tr');
const config = require('../../ayarlar');

module.exports = {
    name: 'envanter',
    description: 'Oyuncu üzerinde envanter işlemleri yaparsınız.',
    role: 'admin',
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'ekle',
            description: 'Oyuncuya eşya eklemenize yarar.',
            options: [
                { name: 'ID', description: 'Oyuncunun ID\'sini giriniz.', required: true, type: 'INTEGER' },
                { name: 'eşya', description: 'Vericeğiniz eşyayı yazınız.', required: true, type: 'STRING' },
                { name: 'miktar', description: 'Eşya miktarı giriniz lütfen.', required: false, type: 'INTEGER' }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'çıkar',
            description: 'Oyuncudan eşya almanıza yarar.',
            options: [
                { name: 'ID', description: 'Oyuncunun ID\'sini giriniz.', required: true, type: 'INTEGER' },
                { name: 'eşya', description: 'Silinecek eşyayı yazınız.', required: true, type: 'STRING' },
                { name: 'miktar', description: 'Eşya miktarı giriniz lütfen.', required: false, type: 'INTEGER' }
            ]
        }
    ]
};
