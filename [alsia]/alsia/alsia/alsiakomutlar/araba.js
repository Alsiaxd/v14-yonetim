const config = require('../../ayarlar');
const { Permissions, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const moment = require('moment');
require('moment/locale/tr'); // Moment için Türkçe dil desteği
moment.locale('tr');

// Bildirim yerine sohbet kullanımı için bir seçenek
const useNotifyInsteadOfChat = false;

// Araç durumları sözlüğü
const vehicleStates = {
  0: 'Sokakta',
  1: 'Garajda',
  2: 'Çekilmiş Garajda',
  3: 'Bilinmiyor'
};

module.exports = {
  name: 'araç', // Komut adı
  description: 'Araç Verme Ve Plaka Sorgu Yaparsınız.', // Komut açıklaması
  role: 'Araç', // Rol bilgisi
  options: [
    {
      type: 'SUB_COMMAND', // Alt komut tipi
      name: 'ver', // Alt komut adı
      description: 'Araç vermenizi sağlar.', // Alt komut açıklaması
      options: [
        {
          name: 'id',
          description: 'Araç ID’si veriniz.', // ID bilgisi
          required: true,
          type: 'INTEGER'
        },
        {
          name: 'model',
          description: 'Araç modeli veriniz. Örnek: t20', // Araç modeli
          required: true,
          type: 'STRING'
        },
        {
          name: 'plaka',
          description: 'Özel plaka vermenizi sağlar. Zorunlu değildir. NOT: Max 8 Karakter Olabilir Plaka', // Özel plaka
          required: false,
          type: 'STRING'
        }
      ]
    },
    {
      type: 'SUB_COMMAND',
      name: 'sorgu', // Sorgu komutu
      description: 'Yazdığınız plakayı sorgularsınız.', // Sorgu açıklaması
      options: [
        {
          name: 'plaka',
          description: 'Bakmak istediğiniz plakayı yazınız lütfen.', // Sorgulama yapılacak plaka
          required: true,
          type: 'STRING'
        }
      ]
    }
  ],
  run: async (client, interaction, options) => {
    if (interaction.channelId !== config['BotKomut']) {
      return interaction.reply({
        content: '*Hey, merhaba bot komut işlemlerini sadece belirli bir kanalda yapabilirsin!*', // Komutun çalışabileceği kanal kısıtlaması
        ephemeral: true
      }).catch(() => {});
    }

    if (options.ver) { // Araç verme işlemi
      if (!GetPlayerName(options.id)) {
        return interaction.reply({
          content: '*Girdiğiniz ID’ye ait hiçbir oyuncu bulunmamaktadır.*',
          ephemeral: true
        });
      }

      const player = client.players.get(options.id); // Oyuncu bilgisi alma
      const vehicles = client.vehicles.all; // Tüm araçları al
      const vehicleModel = vehicles.find(v => v.model.toLowerCase() === options.model.toLowerCase());

      if (!vehicleModel) {
        return interaction.reply({
          content: `*Girdiğiniz model’e ait bir araç yoktur* ${options.model}`,
          ephemeral: true
        });
      }

      const plate = options.plaka ? options.plaka.toUpperCase() : await createPlate(); // Plaka oluşturma veya mevcut olanı kullanma
      if (plate.length > 8) {
        return interaction.reply({
          content: '*Özel plaka maksimum 8 karakter olabilir*',
          ephemeral: true
        });
      }

      const existingVehicle = await getVehicleByPlate(plate); // Plaka kontrolü
      if (existingVehicle.length > 0) {
        return interaction.reply({
          content: '*Bu plaka başka bir araçta mevcuttur lütfen farklı bir plaka giriniz.*',
          ephemeral: true
        });
      }

      // Araç verme işlemleri burada devam eder...
    }

    if (options.sorgu) { // Plaka sorgulama işlemi
      const plate = options.plaka.toUpperCase();
      const vehicle = await getVehicleByPlate(plate); // Plaka ile araç sorgulama

      if (vehicle.length === 0) {
        return interaction.reply({
          content: '*Sorgulamak istediğiniz plaka kayıtlarda bulunamadı.*',
          ephemeral: true
        });
      }

      // Araç bilgilerini embed ile gönderme işlemleri...
    }
  }
};
