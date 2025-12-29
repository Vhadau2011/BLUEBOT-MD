/*
 * Copyright (c) 2025 YourName
 * This file is part of the bot project.
 * You may use, copy, modify, and distribute this file,
 * but do not claim it as your own or remove this notice.
 */

module.exports = {
    caller: "repo",
    aliases: ["project", "source", "about"],
    react: "📦",
    fromWho: true, // anyone can use

    async execute(sock, msg) {
        const from = msg.key.remoteJid

        const text = `
📦 *Project / Repo Info* 📦

🔗 *Repo Link:* https://github.com/Vhadau2011/BLUEBOT-MD 
📝 *Description:* This bot is a WhatsApp multi-feature bot with admin commands, events, anti-link, and activity tracking.
👑 *Owner:* @${process.env.OWNER_NUMBER}
🤝 *Team:* ༺░▒▓█♜đΔɍꝁ ħɇΔɍŧ's♜░▒▓█⨺⃝Х⨺⃝Х̶̿̀͊̍̈́͑̓̈́̃̆́ ⨺⃝Х̶̿̀͊̍̈́͑̓̈́̃̆́ ⁶⁶⁶

✨ Feel free to contribute or report issues on the official channel and community!
        `

        await sock.sendMessage(from, { text, mentions: [process.env.OWNER_NUMBER + "@s.whatsapp.net"] }, { quoted: msg })
    }
}

const modsStore = require("./modsStore")

module.exports = {
    caller: "addmod",
    aliases: [],
    react: "➕",
    fromWho: true, // owner-only

    async execute(sock, msg, args, { from, isGroup }) {
        if (!isGroup) return sock.sendMessage(from, { text: "❌ This command works only in groups." }, { quoted: msg })

        const owner = process.env.OWNER_NUMBER + "@s.whatsapp.net"
        const sender = msg.key.participant || msg.key.remoteJid
        if (sender !== owner) return sock.sendMessage(from, { text: "❌ Only the bot owner can add mods." }, { quoted: msg })

        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid
        if (!mentioned || !mentioned.length) return sock.sendMessage(from, { text: "❌ Mention a user to add as mod." }, { quoted: msg })

        mentioned.forEach(user => modsStore.addMod(from, user))
        await sock.sendMessage(from, { text: `✅ Added as mod: ${mentioned.map(u => "@" + u.split("@")[0]).join(", ")}`, mentions: mentioned }, { quoted: msg })
    }
}

const modsStore = require("./modsStore")

module.exports = {
    caller: "delmod",
    aliases: [],
    react: "➖",
    fromWho: true, // owner-only

    async execute(sock, msg, args, { from, isGroup }) {
        if (!isGroup) return sock.sendMessage(from, { text: "❌ This command works only in groups." }, { quoted: msg })

        const owner = process.env.OWNER_NUMBER + "@s.whatsapp.net"
        const sender = msg.key.participant || msg.key.remoteJid
        if (sender !== owner) return sock.sendMessage(from, { text: "❌ Only the bot owner can remove mods." }, { quoted: msg })

        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid
        if (!mentioned || !mentioned.length) return sock.sendMessage(from, { text: "❌ Mention a user to remove from mods." }, { quoted: msg })

        mentioned.forEach(user => modsStore.delMod(from, user))
        await sock.sendMessage(from, { text: `✅ Removed from mods: ${mentioned.map(u => "@" + u.split("@")[0]).join(", ")}`, mentions: mentioned }, { quoted: msg })
    }
}

const modsStore = require("./modsStore")

module.exports = {
    caller: "mods",
    aliases: ["moderators"],
    react: "⚜️",
    fromWho: false,

    async execute(sock, msg, args, { from, isGroup }) {
        if (!isGroup) {
            return sock.sendMessage(
                from,
                { text: "❌ This command works only in groups." },
                { quoted: msg }
            )
        }

        const mods = modsStore.getMods(from)
        if (!mods.length) {
            return sock.sendMessage(
                from,
                { text: "⚠️ No moderators are set in this group." },
                { quoted: msg }
            )
        }

        let text = `[BLUEBOT-MD]\n`
        text += `[⚔️ MODERATOR LIST ⚔️]\n`
        text += `|\n`

        mods.forEach(u => {
            text += `|🗡️ @${u.split("@")[0]}\n`
        })

        text += `
━━━━━━━━━━━━━━━━━━━━
> ⚠️ WARNING
Use of this command without a valid reason
or abusing moderators may lead to
SERIOUS PUNISHMENTS⚜️
━━━━━━━━━━━━━━━━━━━━
        `

        await sock.sendMessage(
            from,
            {
                image: { url: "https://files.catbox.moe/r6zz0i.jpg" },
                caption: text,
                mentions: mods
            },
            { quoted: msg }
        )
    }
}

