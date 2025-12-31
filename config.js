module.exports = {
    SESSION_ID: process.env.SESSION_ID || "", // put you session id here
    BOT_NAME: process.env.BOT_NAME || "BLUEBOT-MD", // put you bot name here 
    PREFIX: process.env.PREFIX || ".", // put you bot prefix here
    WORKTYPE: process.env.WORKTYPE || "public", // enter how you want the bot to be it can be "public" or "privet" 
    ALWAYS_ONLINE: process.env.ALWAYS_ONLINE === "true", // enter true if bot must always be online 
    BOT_PRESENCE: process.env.BOT_PRESENCE || "available",
    MENU_IMAGE: process.env.MENU_IMAGE || "https://files.catbox.moe/r6zz0i.jpg", // enter menu image url 
    OWNER_NAME: process.env.OWNER_NAME || "mudau_t", // enter you name here 
    OWNER_NUMBER: process.env.OWNER_NUMBER || "27799648540", // enter you number here 
    SUDO: process.env.SUDO || "27799648540", // enter sudo number here 
    MODS: process.env.MODS || "27799648540", // enter mods number here 
    WARNCOUNT: Number(process.env.WARNCOUNT) || 4, // enter how many counts/warnings be fore bot do it's action 
    REJECT_CALL: process.env.REJECT_CALL === "on", // enter on if bot must reject all calls 
    STATUS_VIEW: process.env.STATUS_VIEW === "true", // enter true if bot must view user's status
    SAVE_STATUS: process.env.SAVE_STATUS === "true", // enter true if bot must save evry stetus 
    LIKE_STATUS: process.env.LIKE_STATUS === "true", // enter true if you want bot to like evry stutes 
    STATUS_EMOJI: process.env.STATUS_EMOJI || "", // enter a imoji bot must react with whill viewing users stutes 
    REACT: process.env.REACT === "true", // enter true if bot must react to evry message 
    READ_MESSAGE: process.env.READ_MESSAGE === "true", // enter true if you want bot to read all messages 
    CMD_REACT: process.env.CMD_REACT === "off", // enter on if bot must react to all commands 
    LOG_MESSAGES: process.env.LOG_MESSAGES === "on", // mudau_t don't remember what this is fore
    STICKER_PACKNAME: process.env.STICKER_PACKNAME || "BLUEBOT-MD", // enter STICKER_PACKNAME name here 
    STICKER_AUTHOR: process.env.STICKER_AUTHOR || "🩵", // enter STICKER_AUTHOR name here
    CAPTION: process.env.CAPTION || "", // mudau_t don't remember what this is fore
    AUDIO_DATA: process.env.AUDIO_DATA || "", // mudau_t don't remember what this is fore
    ANTIDELETE: process.env.ANTIDELETE === "on", // set on if evry message delete must be sent to owner DMs
    ANTIDELETE_INCHAT: process.env.ANTIDELETE_INCHAT === "off", // set on if evry message deleted must be sent to that group 
    ANTI_EDIT: process.env.ANTI_EDIT === "off",
    ANTI_EDIT_IN_CHAT: process.env.ANTI_EDIT_IN_CHAT === "off",
    WELCOME_MESSAGE: process.env.WELCOME_MESSAGE || "", // enter you welcome message on the group 
    GOODBYE_MESSAGE: process.env.GOODBYE_MESSAGE || "", // enter you goodbye message on the group 
    STARTUP_MSG: process.env.STARTUP_MSG === "on",
    RES_TYPE: process.env.RES_TYPE || "text",
    VV_CMD: process.env.VV_CMD || "", // mudau_t don't remember what this is fore
    SAVE_CMD: process.env.SAVE_CMD || "", // mudau_t don't remember what this is fore
    LANG_CODE: process.env.LANG_CODE || "en", // mudau_t don't remember what this is fore 
    MONGODB_URI: process.env.MONGODB_URI || "", // enter you mongodb
    RENDER_API_KEY: process.env.RENDER_API_KEY || "" // enter you RENDER_API_KEY
}
