const config = require('../../ayarlar');

module.exports = {
    name: 'ready',
    once: true,
    run: async (client) => {
        // Sunucu ID'sini al
        const guild = client.guilds.cache.get(client.ayarlar.SunucuID);
        
        // Sunucu bulunamazsa sadece işlemi bitir
        if (!guild) {
            return;
        }

        // Komutları sunucuya ekle
        await guild.commands.set(client.arrayOfCommands)
            .catch(err => sendLogToChannel(client, '[ALSİA BOT] Komutlar yüklenirken bir hata oluştu: ' + err));

        // Bot durumunu güncelle
        if (client.ayarlar.BotDurumu && client.ayarlar.BotDurumMesaj) {
            statusUpdater(client);
        }

        // Bilgilendirme logları
        sendLogToChannel(client, '[ALSİA BOT] Giriş Yapıldı: ' + client.user.tag);
        sendLogToChannel(client, '[ALSİA BOT] Hazır.');
        client.emit('alsia:ready');
    }
};

// Bot durumunu güncelleme fonksiyonu
async function statusUpdater(client) {
    setInterval(function () {
        try {
            // Rastgele durum mesajını seç
            const statusMessage = client.ayarlar.BotDurumMesaj[
                Math.floor(Math.random() * client.ayarlar.BotDurumMesaj.length)
            ];
            const replacedStatusMessage = client.utils.replaceGlobals(client, statusMessage);

            // Botun durumunu güncelle
            client.user.setPresence({
                activities: [{ name: replacedStatusMessage, type: 'PLAYING' }],
                status: 'idle'
            });
        } catch (err) {
            sendLogToChannel(client, '[ALSİA BOT] Durum güncellenirken bir hata oluştu: ' + err);
        }
    }, 30000); // Her 30 saniyede bir güncelle
}

// Log mesajlarını belirli bir kanala gönderme fonksiyonu
function sendLogToChannel(client, message) {
    // Burada 'KANAL_ID' yerine log göndermek istediğiniz kanalın ID'sini koyun
    const logChannel = client.channels.cache.get('KANAL_ID');
    if (logChannel) {
        logChannel.send(message).catch(err => console.error('[ALSİA BOT] Log gönderilirken bir hata oluştu: ' + err));
    } else {
        console.error('[ALSİA BOT] Log gönderilecek kanal bulunamadı.');
    }
}
