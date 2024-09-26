const util = require('util');
const config = require('../ayarlar');

// Get player identifiers
const getPlayerIdentifiers = playerId => {
    const identifiers = {};
    for (let i = 0; i < GetNumPlayerIdentifiers(playerId); i++) {
        const [key, value] = GetPlayerIdentifier(playerId, i).split(':');
        identifiers[key] = value;
    }
    return identifiers;
};

// Get player Discord ID
const getPlayerDiscordId = playerId => {
    const identifiers = getPlayerIdentifiers(playerId);
    return identifiers['discord'] || false;
};

// Get player by Discord ID
const getPlayerFromDiscordId = async discordId => {
    let player = false;
    getPlayers().some(async playerId => {
        const playerDiscordId = getPlayerDiscordId(playerId);
        if (playerDiscordId === discordId) {
            player = playerId;
            return true;
        }
        return false;
    });
    return player;
};

// Sleep function
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Format a number as two digits
const formatNumber = number => number.toString().padStart(2, '0');

// Replace placeholders in a string with config values
const replacePlaceholders = (str, value) => {
    return str
        .replace(/{SunucuAD}/g, config['SunucuAD'])
        .replace(/{invite}/g, config['DavetLink'])
        .replace(/{Oyuncu}/g, GetNumPlayerIndices());
};

// Logging functions
const log = {
    timestamp: (withSpaces = false) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const hours = formatNumber(now.getHours());
        const minutes = formatNumber(now.getMinutes());
        const seconds = formatNumber(now.getSeconds());
        return `${year}-${month}-${day}${withSpaces ? ' ' : '_'}${hours}${withSpaces ? ':' : '-'}${minutes}${withSpaces ? ':' : '-'}${seconds}`;
    },

    log: (message, { color = '\x1b[0m', tag = 'LOG' } = {}) => {
        log.write(message, { color, tag });
    },

    info: (message, { color = '\x1b[37m', tag = 'INFO' } = {}) => {
        log.write(message, { color, tag });
    },

    warn: (message, { color = '\x1b[33m', tag = 'WARN' } = {}) => {
        log.write(message, { color, tag });
    },

    error: (message, { color = '\x1b[31m', tag = 'ERR' } = {}) => {
        log.write(message, { color, tag, error: true });
    },

    write: (message, { color = '\x1b[0m', tag = 'LOG', error = false } = {}) => {
        const output = error ? process.stderr : process.stdout;
        output.write(`\x1b[1;36m[alsia]\x1b[0m[${log.timestamp()}]${color}[${tag}]: ${message}\n`);
    },

    clean: value => {
        return typeof value === 'string' ? value : util.inspect(value, { depth: Infinity });
    },

    handler: (type, data) => {
        const message = data.toString();
        if (message.includes('[TOKEN_INVALID]')) log.error('Invalid token');
        else if (message.includes('[DISALLOWED_INTENTS]')) log.warn('Disallowed intents');
        else if (message.includes('[HeartbeatTimer]')) log.info('Heartbeat acknowledged');
        else if (type === 'log') log.log(message);
        else if (type === 'info') log.info(message);
        else if (type === 'warn') log.warn(message);
        else if (type === 'error') log.error(message);
    },

    assert: (condition, message) => {
        if (!condition) log.error(message);
    }
};

// Validate ID format
const isValidID = id => /^\d{17,21}$/.test(id);

// Send chat message
const chatMessage = (playerId, message, color = [255, 255, 255], multiline = false) => {
    TriggerClientEvent('chat:addMessage', playerId, { color, multiline, args: [message] });
};

// Export functions
module.exports = {
    getPlayerIdentifiers,
    getPlayerDiscordId,
    getPlayerFromDiscordId,
    sleep,
    formatNumber,
    replacePlaceholders,
    log,
    isValidID,
    chatMessage
};
