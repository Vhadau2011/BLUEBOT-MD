const { downloadAndSendMediaMessage } = require('../framework/modules');

module.exports = {
    name: "vv",
    aliases: ["vv"],
    ownerOnly: false,
    description: "Download and resend a view-once message",
    category: "General",
    async execute(sock, msg, args, { from, msgRepondu, repondre }) {
        try {
            if (!msgRepondu) {
                return await repondre("Please reply to a view-once message", { quoted: msg });
            }

            await downloadAndSendMediaMessage(
                sock,
                from,
                { message: msgRepondu },
                { quoted: msg }
            );
        } catch (error) {
            console.error("Error in viewonce command:", error);
            await repondre("This message does not appear to be a view-once message", { quoted: msg });
        }
    }
};
