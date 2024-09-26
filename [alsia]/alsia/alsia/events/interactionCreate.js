module.exports = {
    name: 'YourCommandName', // Komut adı burada belirtilmelidir.
    run: async (client, interaction) => {
        // Kullanıcı komutun kullanımı için gerekli izinlere sahip mi kontrol et
        if (interaction.isCommand()) {
            // Komut ve izinler
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                return interaction.reply({
                    content: '*Uyarı: böyle bir komut bulunamadı.*',
                    ephemeral: true
                }).catch(error => {
                    client.logger.log('error', error);
                });
            }

            // Yetki kontrolü
            if (!client.hasPermission(interaction.member, command.requiredRole)) {
                return interaction.reply({
                    content: '*- Bu komutu kullanacak yetkiye sahip değilsiniz.*',
                    ephemeral: true
                });
            }

            // Komut seçeneklerini işleme
            const options = {};
            for (const option of interaction.options.data) {
                if (option.type === 'SUB_COMMAND') {
                    if (option.options) {
                        option.options.forEach(subOption => {
                            options[subOption.name] = subOption.value;
                        });
                    }
                } else if (option.value) {
                    options[option.name] = option.value;
                }
            }

            // Komutu çalıştırma
            try {
                await command.run(client, interaction, options);
            } catch (error) {
                client.logger.error(error);
                return interaction.reply({
                    content: '*Komut entegre edilemedi lütfen alsiaxd ulaşın.*',
                    ephemeral: true
                }).catch(error => {
                    client.logger.log('error', error);
                });
            }
        }

        // Context menu işlemi
        if (interaction.isContextMenu()) {
            const contextMenu = client.commands.get(interaction.commandName);
            if (contextMenu) {
                await contextMenu.run(client, interaction);
            }
        }
    }
};
