// Gerekli modülleri import ediyoruz
const { readdirSync } = require('fs');
const fetch = require('node-fetch');
const { GetResourcePath, GetCurrentResourceName, SetConvarReplicated } = require('path-to-your-module'); // Bu modülü kendi projenize göre ayarlayın
const Bot = require('./alsia/bot'); // Bot modülünün yolu


const alsia = {};

alsia.resourcePath = GetResourcePath(GetCurrentResourceName());
alsia.config = require(`${alsia.resourcePath}/config`);
alsia.utils = require(`${alsia.resourcePath}/utils`);

// QBCore nesnesini global olarak alıyoruz
try {
    alsia.QBCore = global.exports['qb-core'].GetCoreObject();
    if (alsia.QBCore) {
        alsia.utils.log('QB-CORE Yüklendi!');
    }
} catch {
    alsia.QBCore = null;
}

// Bot nesnesini oluşturuyoruz
alsia.bot = new Bot(alsia);

// Convar'ları ayarlıyoruz
SetConvarReplicated('serverName', alsia.config.serverName);
SetConvarReplicated('serverIp', alsia.config.serverIp);
SetConvarReplicated('serverLogo', alsia.config.serverLogo);

// Global fonksiyonları ayarlıyoruz
global.exports('isRolePresent', (playerId, role) => {
    return alsia.bot.isRolePresent(playerId, role);
});

global.exports('getMemberRoles', (playerId) => {
    return alsia.bot.getMemberRoles(playerId);
});

global.exports('isLicenseValid', (license) => {
    return alsia.bot.isLicenseValid(license);
});

global.exports('parseMember', (member) => {
    return alsia.utils.parseMember(member);
});

// IP doğrulama işlemi
fetch('https://api.ipify.org')
    .then(response => response.text())
    .then(ip => {
        // IP doğrulaması yapılıyor ancak artık loglama yapılmıyor
        if (ip !== alsia.config.serverIp) {
            console.error('Sunucu IP doğrulaması başarısız.');
        }
    })
    .catch(error => console.error('IP doğrulaması yapılırken bir hata oluştu:', error));
