const fs = require("fs")
const path = require("path")

module.exports = async (sock, msg) => {
    try {
        const from = msg.key.remoteJid
        const isGroup = from.endsWith("@g.us")

        // Extract text safely
        const text =
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text ||
            msg.message?.imageMessage?.caption ||
            msg.message?.videoMessage?.caption ||
            ""

        if (!text) return

        const prefix = process.env.PREFIX || "."
        if (!text.startsWith(prefix)) return

        const args = text.slice(prefix.length).trim().split(/\s+/)
        const commandName = args.shift().toLowerCase()

        // Load commands dynamically
        const commandPath = path.join(__dirname, "../../commands")
        const commandFiles = fs.readdirSync(commandPath).filter(f => f.endsWith(".js"))

        for (const file of commandFiles) {
            const commands = require(path.join(commandPath, file))
            const commandArray = Array.isArray(commands) ? commands : [commands]

            for (const command of commandArray) {
                if (command.caller === commandName) {

                    // Owner-only check
                    if (command.fromWho) {
                        const owner = process.env.OWNER_NUMBER + "@s.whatsapp.net"
                        if (msg.key.participant !== owner && msg.key.remoteJid !== owner) {
                            await sock.sendMessage(from, { text: "❌ This command is owner-only." }, { quoted: msg })
                            return
                        }
                    }

                    // React emoji if set
                    if (command.react) {
                        await sock.sendMessage(from, { react: { text: command.react, key: msg.key } })
                    }

                    // Execute command
                    await command.execute(sock, msg, args, { from, isGroup, text, prefix })
                    return
                }
            }
        }
    } catch (err) {
        console.error("Command handler error:", err)
    }
}
