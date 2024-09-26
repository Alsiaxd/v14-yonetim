const { Client, Collection, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { readdirSync } = require('fs');

class Bot extends Client {
  constructor(config) {
    super({
      intents: 0x37ff,
      fetchAllMembers: true,
      messageCacheMaxSize: 10
    });

    this.config = config.settings;
    this.logger = config.logger;
    this.commands = new Collection();
    this.events = [];
    
    if (this.config) this.initialize();
  }

  initialize() {
    // Log configuration errors
    this.logger.log(!this.config.serverID, 'Server ID is incorrect');
    this.logger.assert(!this.config.adminRole, 'Admin role is missing');
    this.logger.log(!this.config.moderatorRole, 'Moderator role is missing');
    this.logger.log(!this.config.defaultRole, 'Default role is missing');

    // Load commands and events
    this.loadCommands();
    this.loadEvents();

    // Handle warnings and errors
    this.on('warn', warning => this.logger.warn('Warning', warning));
    this.on('error', error => this.logger.error('Error', error));

    // Login to Discord
    this.login(this.config.token).catch(error => this.logger.error('Login failed', error));
  }

  loadCommands() {
    const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      if (!command.name) continue;
      
      this.commands.set(command.name, command);
    }
  }

  loadEvents() {
    const eventFiles = readdirSync('./events').filter(file => file.endsWith('.js'));
    
    for (const file of eventFiles) {
      const event = require(`./events/${file}`);
      if (event.once) {
        this.once(event.name, (...args) => event.execute(this, ...args));
      } else {
        this.on(event.name, (...args) => event.execute(this, ...args));
      }
    }
  }

  async paginate(interaction, pages, buttons, timeout = 30000) {
    let page = 0;
    const row = new MessageActionRow().addComponents(buttons);
    
    if (!interaction.replied) await interaction.deferReply();
    
    const message = await interaction.editReply({
      embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
      components: [row]
    });

    const filter = i => buttons.some(button => i.customId === button.customId);
    const collector = message.createMessageComponentCollector({ filter, time: timeout });

    collector.on('collect', async i => {
      if (i.customId === buttons[0].customId) {
        page = page > 0 ? --page : pages.length - 1;
      } else if (i.customId === buttons[1].customId) {
        page = page + 1 < pages.length ? ++page : 0;
      }
      
      await i.deferUpdate();
      await i.editReply({
        embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
        components: [row]
      });
    });

    collector.on('end', () => {
      const disabledRow = new MessageActionRow()
        .addComponents(buttons[0].setDisabled(true), buttons[1].setDisabled(true));
        
      message.edit({
        embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
        components: [disabledRow]
      });
    });

    return message;
  }

  hasRole(member, role) {
    return member.roles.cache.has(role);
  }

  getMemberRoles(member) {
    return member.roles.cache.map(role => role.id);
  }

  hasPermission(member, permission) {
    switch (permission) {
      case 'admin':
        return this.hasRole(member, this.config.adminRole) || this.hasRole(member, this.config.moderatorRole);
      case 'moderator':
        return this.hasRole(member, this.config.moderatorRole);
      case 'user':
        return this.hasRole(member, this.config.defaultRole);
      default:
        return false;
    }
  }
}

module.exports = Bot;
