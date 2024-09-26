module.exports = {
    BotAktif: true,
    SlashAktif: true,

    EmbedYazı: "ᴀᴜʀᴀᴠ ʀᴏʟᴇᴘʟᴀʏ",
    EmbedYazıNormal: "AuraV",

    SunucuAD: "AURA V ROLEPLAY",
    DavetLink: "https://discord.gg/aurav",
    SunucuIP: "185.137.98.177",

    Anons: "[AURAV - ANONS]",
    ÖzelMesaj: "[AURAV - YETKILI]",

    IcLog: "",
 BotKomut: "1277374104420352064",


    alsiatoken: "",
    SunucuID: "",

    Moderatör: "",
    Admin: "",
    Yönetici: "",

    Gif: "",

    BotDurumu: true,
    BotDurumMesaj: [
        "{SunucuAD}",
        "{Oyuncu}/300",
    ],

    GörüntüKaydet: true,

    Revive: "hospital:client:Revive",
    Kıyafet: "fivem-appearance:server:migrate-qb-clothing-skin"
}

/** 
 * @param {boolean|string|number} con 
 * @param {boolean|string|number} def 
 * @returns {boolean} */
function getConBool(con, def) {
    if (typeof def == "boolean") def = def.toString();
    const ret = GetConvar(con, def);
    if (typeof ret == "boolean") return ret;
    if (typeof ret == "string") return ["true", "on", "yes", "y", "1"].includes(ret.toLocaleLowerCase().trim());
    if (typeof ret == "number") return ret > 0;
    return false;
}

/** 
 * @param {string} con 
 * @param {string|Array} def -
 * @returns {object}  */
function getConList(con, def) {
    const ret = GetConvar(con, def);
    if (typeof ret == "string") return ret.replace(/[^0-9,]/g, "").replace(/(,$)/g, "").split(",");
    if (Array.isArray(ret)) return ret;
    if (!ret) return [];
}
