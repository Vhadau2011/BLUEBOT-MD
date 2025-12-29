/*
 * Copyright (c) 2025 YourName
 * This file is part of the bot project.
 * You may use, copy, modify, and distribute this file,
 * but do not claim it as your own or remove this notice.
 */

module.exports = {
    caller: "kick",
    aliases: [],
    react: "👢",
    fromWho: false, // Not owner-only, just group admin

    async execute(sock, msg, args, { from, isGroup }) {
        if (!isGroup) {
            return sock.sendMessage(
                from,
                { text: "*_❌ This command only works in groups._*" },
                { quoted: msg }
            )
        }

        // Get sender and mentioned user
        const sender = msg.key.participant
        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid

        if (!mentioned || !mentioned[0]) {
            return sock.sendMessage(
                from,
                { text: "*_❌ You must mention at least one user to kick._*" },
                { quoted: msg }
            )
        }

        // Get group metadata to check admins
        const group = await sock.groupMetadata(from)
        const admins = group.participants
            .filter(p => p.admin)
            .map(p => p.id)

        // Check if sender is admin
        if (!admins.includes(sender)) {
            return sock.sendMessage(
                from,
                { text: "*_❌ Only group admins can use this command baka._*" },
                { quoted: msg }
            )
        }

        // Check if bot is admin
        const botId = sock.user.id
        if (!admins.includes(botId)) {
            return sock.sendMessage(
                from,
                { text: "*_❌ I need to be an admin to kick someone baka._*" },
                { quoted: msg }
            )
        }

        // Kick mentioned users
        await sock.groupParticipantsUpdate(from, mentioned, "remove")

        await sock.sendMessage(
            from,
            { text: `✅ Successfully kicked: ${mentioned.map(u => "@" + u.split("@")[0]).join(", ")}` },
            { quoted: msg, mentions: mentioned }
        )
    }
}

module.exports = {
    caller: "add",
    aliases: [],
    react: "➕",
    fromWho: false, // Not owner-only, just group admin

    async execute(sock, msg, args, { from, isGroup }) {
        if (!isGroup) {
            return sock.sendMessage(
                from,
                { text: "❌ This command only works in groups." },
                { quoted: msg }
            )
        }

        // Check if sender is admin
        const sender = msg.key.participant
        const group = await sock.groupMetadata(from)
        const admins = group.participants.filter(p => p.admin).map(p => p.id)

        if (!admins.includes(sender)) {
            return sock.sendMessage(
                from,
                { text: "❌ Only group admins can add someone." },
                { quoted: msg }
            )
        }

        // Check if bot is admin
        const botId = sock.user.id
        if (!admins.includes(botId)) {
            return sock.sendMessage(
                from,
                { text: "❌ I need to be an admin to add someone." },
                { quoted: msg }
            )
        }

        // Check if phone number is provided
        if (!args[0]) {
            return sock.sendMessage(
                from,
                { text: "❌ Please provide a phone number. Example: .add 27812345678" },
                { quoted: msg }
            )
        }

        const userId = args[0].replace(/\D/g, "") + "@s.whatsapp.net"

        try {
            await sock.groupParticipantsUpdate(from, [userId], "add")
            await sock.sendMessage(
                from,
                { text: `✅ Successfully added: @${args[0]}` },
                { quoted: msg, mentions: [userId] }
            )
        } catch (err) {
            await sock.sendMessage(
                from,
                { text: `❌ Could not add @${args[0]}. Maybe they have privacy settings enabled.` },
                { quoted: msg }
            )
        }
    }
}

module.exports = {
    caller: "promote",
    aliases: [],
    react: "📈",
    fromWho: false, // Not owner-only, just group admin

    async execute(sock, msg, args, { from, isGroup }) {
        if (!isGroup) {
            return sock.sendMessage(
                from,
                { text: "❌ This command only works in groups." },
                { quoted: msg }
            )
        }

        // Get sender and mentioned user
        const sender = msg.key.participant
        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid

        if (!mentioned || !mentioned[0]) {
            return sock.sendMessage(
                from,
                { text: "❌ You must mention at least one user to promote." },
                { quoted: msg }
            )
        }

        // Get group metadata
        const group = await sock.groupMetadata(from)
        const admins = group.participants
            .filter(p => p.admin)
            .map(p => p.id)

        // Check if sender is admin
        if (!admins.includes(sender)) {
            return sock.sendMessage(
                from,
                { text: "❌ Only group admins can use this command." },
                { quoted: msg }
            )
        }

        // Check if bot is admin
        const botId = sock.user.id
        if (!admins.includes(botId)) {
            return sock.sendMessage(
                from,
                { text: "❌ I need to be an admin to promote someone." },
                { quoted: msg }
            )
        }

        // Promote mentioned users
        await sock.groupParticipantsUpdate(from, mentioned, "promote")

        await sock.sendMessage(
            from,
            { text: `✅ Successfully promoted: ${mentioned.map(u => "@" + u.split("@")[0]).join(", ")}` },
            { quoted: msg, mentions: mentioned }
        )
    }
}

module.exports = {
    caller: "demote",
    aliases: [],
    react: "📉",
    fromWho: false, // Not owner-only, just group admin

    async execute(sock, msg, args, { from, isGroup }) {
        if (!isGroup) {
            return sock.sendMessage(
                from,
                { text: "❌ This command only works in groups." },
                { quoted: msg }
            )
        }

        // Get sender and mentioned user
        const sender = msg.key.participant
        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid

        if (!mentioned || !mentioned[0]) {
            return sock.sendMessage(
                from,
                { text: "❌ You must mention at least one user to demote." },
                { quoted: msg }
            )
        }

        // Get group metadata
        const group = await sock.groupMetadata(from)
        const admins = group.participants
            .filter(p => p.admin)
            .map(p => p.id)

        // Check if sender is admin
        if (!admins.includes(sender)) {
            return sock.sendMessage(
                from,
                { text: "❌ Only group admins can use this command." },
                { quoted: msg }
            )
        }

        // Check if bot is admin
        const botId = sock.user.id
        if (!admins.includes(botId)) {
            return sock.sendMessage(
                from,
                { text: "❌ I need to be an admin to demote someone." },
                { quoted: msg }
            )
        }

        // Demote mentioned users
        await sock.groupParticipantsUpdate(from, mentioned, "demote")

        await sock.sendMessage(
            from,
            { text: `✅ Successfully demoted: ${mentioned.map(u => "@" + u.split("@")[0]).join(", ")}` },
            { quoted: msg, mentions: mentioned }
        )
    }
}

module.exports = {
    caller: "setname",
    aliases: ["rename"],
    react: "✏️",
    fromWho: false, // Not owner-only, just group admin

    async execute(sock, msg, args, { from, isGroup }) {
        if (!isGroup) {
            return sock.sendMessage(
                from,
                { text: "❌ This command only works in groups." },
                { quoted: msg }
            )
        }

        // Get sender and check admin
        const sender = msg.key.participant
        const group = await sock.groupMetadata(from)
        const admins = group.participants.filter(p => p.admin).map(p => p.id)

        if (!admins.includes(sender)) {
            return sock.sendMessage(
                from,
                { text: "❌ Only group admins can use this command." },
                { quoted: msg }
            )
        }

        // Check if bot is admin
        const botId = sock.user.id
        if (!admins.includes(botId)) {
            return sock.sendMessage(
                from,
                { text: "❌ I need to be an admin to change the group name." },
                { quoted: msg }
            )
        }

        // Check if new name is provided
        const newName = args.join(" ")
        if (!newName) {
            return sock.sendMessage(
                from,
                { text: "❌ Please provide a new group name. Example: .setname My Group" },
                { quoted: msg }
            )
        }

        // Update group name
        await sock.groupUpdateSubject(from, newName)

        await sock.sendMessage(
            from,
            { text: `✅ Group name successfully changed to: ${newName}` },
            { quoted: msg }
        )
    }
}

module.exports = {
    caller: "setdesc",
    aliases: ["desc", "description"],
    react: "📝",
    fromWho: false, // Not owner-only, just group admin

    async execute(sock, msg, args, { from, isGroup }) {
        if (!isGroup) {
            return sock.sendMessage(
                from,
                { text: "❌ This command only works in groups." },
                { quoted: msg }
            )
        }

        // Get sender and check admin
        const sender = msg.key.participant
        const group = await sock.groupMetadata(from)
        const admins = group.participants.filter(p => p.admin).map(p => p.id)

        if (!admins.includes(sender)) {
            return sock.sendMessage(
                from,
                { text: "❌ Only group admins can use this command." },
                { quoted: msg }
            )
        }

        // Check if bot is admin
        const botId = sock.user.id
        if (!admins.includes(botId)) {
            return sock.sendMessage(
                from,
                { text: "❌ I need to be an admin to change the group description." },
                { quoted: msg }
            )
        }

        // Check if new description is provided
        const newDesc = args.join(" ")
        if (!newDesc) {
            return sock.sendMessage(
                from,
                { text: "❌ Please provide a new group description. Example: .setdesc Welcome to my group" },
                { quoted: msg }
            )
        }

        // Update group description
        await sock.groupUpdateDescription(from, newDesc)

        await sock.sendMessage(
            from,
            { text: `✅ Group description successfully changed.` },
            { quoted: msg }
        )
    }
}

module.exports = {
    caller: "setgpp",
    aliases: ["setpic", "gpp"],
    react: "🖼️",
    fromWho: false, // Not owner-only, just group admin

    async execute(sock, msg, args, { from, isGroup }) {
        if (!isGroup) {
            return sock.sendMessage(
                from,
                { text: "❌ This command only works in groups." },
                { quoted: msg }
            )
        }

        // Check if sender is admin
        const sender = msg.key.participant
        const group = await sock.groupMetadata(from)
        const admins = group.participants.filter(p => p.admin).map(p => p.id)

        if (!admins.includes(sender)) {
            return sock.sendMessage(
                from,
                { text: "❌ Only group admins can change the group picture." },
                { quoted: msg }
            )
        }

        // Check if bot is admin
        const botId = sock.user.id
        if (!admins.includes(botId)) {
            return sock.sendMessage(
                from,
                { text: "❌ I need to be an admin to change the group picture." },
                { quoted: msg }
            )
        }

        // Get image from message or quoted message
        let buffer
        if (msg.message.imageMessage) {
            buffer = await sock.downloadMediaMessage(msg)
        } else if (msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
            const quoted = msg.message.extendedTextMessage.contextInfo.quotedMessage
            buffer = await sock.downloadMediaMessage({ message: quoted })
        } else {
            return sock.sendMessage(
                from,
                { text: "❌ Please send an image with the command or reply to an image." },
                { quoted: msg }
            )
        }

        // Set group profile picture
        try {
            await sock.updateProfilePicture(from, buffer)
            await sock.sendMessage(
                from,
                { text: "✅ Group profile picture updated successfully." },
                { quoted: msg }
            )
        } catch (err) {
            await sock.sendMessage(
                from,
                { text: "❌ Failed to update group picture. Make sure I am an admin." },
                { quoted: msg }
            )
        }
    }
}

module.exports = {
    caller: "ginfo",
    aliases: ["groupinfo", "gi"],
    react: "ℹ️",
    fromWho: false, // usable by anyone

    async execute(sock, msg, args, { from, isGroup }) {
        if (!isGroup) {
            return sock.sendMessage(
                from,
                { text: "❌ This command only works in groups." },
                { quoted: msg }
            )
        }

        try {
            const group = await sock.groupMetadata(from)

            // Get group picture (if available)
            let gppBuffer
            try {
                gppBuffer = await sock.profilePictureUrl(from, "image")
                gppBuffer = await (await fetch(gppBuffer)).arrayBuffer()
                gppBuffer = Buffer.from(gppBuffer)
            } catch {
                gppBuffer = null // default if no picture
            }

            const groupName = group.subject
            const groupId = group.id
            const owner = group.owner || "Unknown"
            const memberCount = group.participants.length
            const admins = group.participants
                .filter(p => p.admin)
                .map(p => "@" + p.id.split("@")[0])
                .join(", ") || "None"
            const description = group.desc || "No description"

            const caption = `
🎀 *Group Info* 🎀

💠 *Name:* ${groupName}
🆔 *ID:* ${groupId}
👑 *Owner:* @${owner.split("@")[0]}
👥 *Members:* ${memberCount}
🛡️ *Admins:* ${admins}
📝 *Description:* ${description}

✨ Stay active and enjoy the group! ✨
            `

            if (gppBuffer) {
                await sock.sendMessage(from, {
                    image: gppBuffer,
                    caption,
                    mentions: [owner, ...group.participants.map(p => p.id)]
                }, { quoted: msg })
            } else {
                await sock.sendMessage(from, {
                    text: caption,
                    mentions: [owner, ...group.participants.map(p => p.id)]
                }, { quoted: msg })
            }

        } catch (err) {
            await sock.sendMessage(
                from,
                { text: "❌ Failed to fetch group info." },
                { quoted: msg }
            )
            console.error(err)
        }
    }
}

module.exports = {
    caller: "tagall",
    aliases: ["all", "everyone"],
    react: "📢",
    fromWho: false, // Not owner-only, just group admin

    async execute(sock, msg, args, { from, isGroup }) {
        if (!isGroup) {
            return sock.sendMessage(
                from,
                { text: "❌ This command only works in groups." },
                { quoted: msg }
            )
        }

        // Check if sender is admin
        const sender = msg.key.participant
        const group = await sock.groupMetadata(from)
        const admins = group.participants.filter(p => p.admin).map(p => p.id)

        if (!admins.includes(sender)) {
            return sock.sendMessage(
                from,
                { text: "❌ Only group admins can use this command." },
                { quoted: msg }
            )
        }

        const members = group.participants.map(p => p.id)
        const customText = args.join(" ") || "Attention everyone!"

        // Format message
        let text = `📢 *Tagging Everyone* 📢\n\n${customText}\n\n`
        members.forEach((u, i) => {
            text += `👤 @${u.split("@")[0]}\n`
        })

        await sock.sendMessage(
            from,
            { text, mentions: members },
            { quoted: msg }
        )
    }
}

// Map to track muted users per group
const mutedUsers = new Map() // key = groupId, value = Set of muted userIds

module.exports = {
    caller: "mute",
    aliases: [],
    react: "🔇",
    fromWho: false, // Not owner-only, just group admin

    async execute(sock, msg, args, { from, isGroup }) {
        if (!isGroup) return sock.sendMessage(from, { text: "❌ This command only works in groups." }, { quoted: msg })

        const sender = msg.key.participant
        const group = await sock.groupMetadata(from)
        const admins = group.participants.filter(p => p.admin).map(p => p.id)

        if (!admins.includes(sender)) return sock.sendMessage(from, { text: "❌ Only admins can mute users." }, { quoted: msg })

        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid
        if (!mentioned || !mentioned.length) return sock.sendMessage(from, { text: "❌ Mention at least one user to mute." }, { quoted: msg })

        // Initialize muted set for the group if not exists
        if (!mutedUsers.has(from)) mutedUsers.set(from, new Set())
        const groupMuted = mutedUsers.get(from)

        // Add users to muted set
        mentioned.forEach(user => groupMuted.add(user))

        await sock.sendMessage(from, {
            text: `🔇 Muted users: ${mentioned.map(u => "@" + u.split("@")[0]).join(", ")}`
        }, { quoted: msg, mentions: mentioned })
    },

    // Extra: function to check messages and delete from muted users
    checkMessage: async function(sock, msg) {
        if (!msg.key.remoteJid.endsWith("@g.us")) return // only groups
        const groupId = msg.key.remoteJid
        const sender = msg.key.participant

        const groupMuted = mutedUsers.get(groupId)
        if (groupMuted && groupMuted.has(sender)) {
            try {
                await sock.sendMessage(groupId, { delete: msg.key })
            } catch (err) {
                console.error("Failed to delete muted user's message:", err)
            }
        }
    }
}

const groupSettings = new Map() // key = groupId, value = { welcome, goodbye, welcomeEnabled, goodbyeEnabled }

module.exports = {
    caller: "events",
    aliases: ["event"],
    react: "🎉",
    fromWho: false, // any group admin can use

    async execute(sock, msg, args, { from, isGroup }) {
        if (!isGroup) return sock.sendMessage(from, { text: "❌ This command works only in groups." }, { quoted: msg })

        const sender = msg.key.participant
        const group = await sock.groupMetadata(from)
        const admins = group.participants.filter(p => p.admin).map(p => p.id)

        if (!admins.includes(sender)) {
            return sock.sendMessage(from, { text: "❌ Only admins can manage events." }, { quoted: msg })
        }

        if (!groupSettings.has(from)) {
            groupSettings.set(from, {
                welcome: "Welcome to the group!",
                goodbye: "Goodbye!",
                welcomeEnabled: false,
                goodbyeEnabled: false
            })
        }

        const settings = groupSettings.get(from)

        const subCommand = args[0]?.toLowerCase()
        const textArg = args.slice(1).join(" ")

        switch (subCommand) {
            case "setwelcome":
                if (!textArg) return sock.sendMessage(from, { text: "❌ Usage: .events setwelcome <message>" }, { quoted: msg })
                settings.welcome = textArg
                return sock.sendMessage(from, { text: `✅ Welcome message set to:\n${textArg}` }, { quoted: msg })

            case "setgoodbye":
                if (!textArg) return sock.sendMessage(from, { text: "❌ Usage: .events setgoodbye <message>" }, { quoted: msg })
                settings.goodbye = textArg
                return sock.sendMessage(from, { text: `✅ Goodbye message set to:\n${textArg}` }, { quoted: msg })

            case "welcome":
                if (textArg !== "on" && textArg !== "off") return sock.sendMessage(from, { text: "❌ Usage: .events welcome on/off" }, { quoted: msg })
                settings.welcomeEnabled = textArg === "on"
                return sock.sendMessage(from, { text: `✅ Welcome messages are now ${textArg.toUpperCase()}` }, { quoted: msg })

            case "goodbye":
                if (textArg !== "on" && textArg !== "off") return sock.sendMessage(from, { text: "❌ Usage: .events goodbye on/off" }, { quoted: msg })
                settings.goodbyeEnabled = textArg === "on"
                return sock.sendMessage(from, { text: `✅ Goodbye messages are now ${textArg.toUpperCase()}` }, { quoted: msg })

            default:
                // Help message
                return sock.sendMessage(from, {
                    text: `📌 *Events Command Guide* 📌

Usage:
- .events setwelcome <message> → Set welcome message
- .events setgoodbye <message> → Set goodbye message
- .events welcome on/off → Enable or disable welcome messages
- .events goodbye on/off → Enable or disable goodbye messages

Example:
.events setwelcome Welcome @user to the group!
.events welcome on`
                }, { quoted: msg })
        }
    },

    // Optional: function to handle when a member joins or leaves
    async memberUpdate(sock, action, groupId, userId) {
        const settings = groupSettings.get(groupId)
        if (!settings) return

        try {
            if (action === "add" && settings.welcomeEnabled) {
                const msg = settings.welcome.replace(/@user/g, `@${userId.split("@")[0]}`)
                await sock.sendMessage(groupId, { text: msg, mentions: [userId] })
            }
            if (action === "remove" && settings.goodbyeEnabled) {
                const msg = settings.goodbye.replace(/@user/g, `@${userId.split("@")[0]}`)
                await sock.sendMessage(groupId, { text: msg, mentions: [userId] })
            }
        } catch (err) {
            console.error("Events error:", err)
        }
    }
                    }

const antiLinkGroups = new Map() // key = groupId, value = true/false

module.exports = {
    caller: "antilink",
    aliases: ["antilinks", "antilink on/off"],
    react: "🚫",
    fromWho: false, // not owner-only, admin control

    async execute(sock, msg, args, { from, isGroup }) {
        if (!isGroup) return sock.sendMessage(from, { text: "❌ This command works only in groups." }, { quoted: msg })

        const sender = msg.key.participant
        const group = await sock.groupMetadata(from)
        const admins = group.participants.filter(p => p.admin).map(p => p.id)

        if (!admins.includes(sender)) return sock.sendMessage(from, { text: "❌ Only admins can manage anti-link." }, { quoted: msg })

        const option = args[0]?.toLowerCase()
        if (!option || (option !== "on" && option !== "off")) {
            return sock.sendMessage(from, {
                text: `📌 *Anti-Link Guide*\nUsage:\n.antilink on → Enable anti-link\n.antilink off → Disable anti-link`
            }, { quoted: msg })
        }

        antiLinkGroups.set(from, option === "on")
        await sock.sendMessage(from, { text: `✅ Anti-Link is now ${option.toUpperCase()}` }, { quoted: msg })
    },

    // Function to check messages and delete if link is posted
    async checkMessage(sock, msg) {
        if (!msg.key.remoteJid.endsWith("@g.us")) return
        const groupId = msg.key.remoteJid
        const sender = msg.key.participant

        const group = await sock.groupMetadata(groupId)
        const admins = group.participants.filter(p => p.admin).map(p => p.id)

        const antiLinkEnabled = antiLinkGroups.get(groupId)
        if (!antiLinkEnabled) return

        const text =
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text ||
            msg.message?.imageMessage?.caption ||
            msg.message?.videoMessage?.caption ||
            ""

        // Detect WhatsApp group link
        const linkRegex = /chat\.whatsapp\.com\/[0-9A-Za-z]+/i
        if (linkRegex.test(text) && !admins.includes(sender)) {
            try {
                // Delete the message
                await sock.sendMessage(groupId, { delete: msg.key })
                await sock.sendMessage(groupId, { text: `❌ @${sender.split("@")[0]} posting group links is not allowed!`, mentions: [sender] })
            } catch (err) {
                console.error("Anti-link error:", err)
            }
        }
    }
}

module.exports = {
    caller: "join",
    aliases: [],
    react: "🤖",
    fromWho: true, // owner-only

    async execute(sock, msg, args) {
        const owner = process.env.OWNER_NUMBER + "@s.whatsapp.net"
        const sender = msg.key.participant || msg.key.remoteJid

        if (sender !== owner) {
            return sock.sendMessage(msg.key.remoteJid, { text: "❌ Only the bot owner can use this command." }, { quoted: msg })
        }

        const inviteLink = args[0]
        if (!inviteLink) {
            return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .join <invite link>" }, { quoted: msg })
        }

        try {
            // Extract code from the link
            const codeMatch = inviteLink.match(/(https:\/\/chat\.whatsapp\.com\/)([0-9A-Za-z]+)/)
            if (!codeMatch) {
                return sock.sendMessage(msg.key.remoteJid, { text: "❌ Invalid WhatsApp group invite link." }, { quoted: msg })
            }
            const inviteCode = codeMatch[2]

            // Accept the invite
            await sock.groupAcceptInvite(inviteCode)

            await sock.sendMessage(msg.key.remoteJid, { text: `✅ Successfully joined the group!` }, { quoted: msg })
        } catch (err) {
            console.error("Join error:", err)
            await sock.sendMessage(msg.key.remoteJid, { text: "❌ Failed to join the group. Make sure the link is valid." }, { quoted: msg })
        }
    }
}

module.exports = {
    caller: "leave",
    aliases: ["bye"],
    react: "👋",
    fromWho: true, // owner-only

    async execute(sock, msg) {
        const owner = process.env.OWNER_NUMBER + "@s.whatsapp.net"
        const sender = msg.key.participant || msg.key.remoteJid

        if (sender !== owner) {
            return sock.sendMessage(msg.key.remoteJid, { text: "❌ Only the bot owner can use this command." }, { quoted: msg })
        }

        const groupId = msg.key.remoteJid
        if (!groupId.endsWith("@g.us")) {
            return sock.sendMessage(groupId, { text: "❌ This command can only be used in groups." }, { quoted: msg })
        }

        await sock.sendMessage(groupId, { text: "👋 Leaving the group..." }, { quoted: msg })

        try {
            await sock.groupLeave(groupId)
        } catch (err) {
            console.error("Leave group error:", err)
            await sock.sendMessage(groupId, { text: "❌ Failed to leave the group." })
        }
    }
            }

