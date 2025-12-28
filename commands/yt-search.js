const yts = require("yt-search");

module.exports = {
    name: "yts",
    aliases: ["ytsearch"],
    ownerOnly: false,
    async execute(sock, msg, args, { from }) {
        if (!args[0]) return await sock.sendMessage(from, { text: "Please enter a search term." }, { quoted: msg });

        try {
            const result = await yts(args.join(" "));
            const videos = result.videos.slice(0, 10); // top 10 results
            let text = "";

            for (let i = 0; i < videos.length; i++) {
                text += `\n🎬 Title: ${videos[i].title}\n🕒 Duration: ${videos[i].timestamp}\n🔗 Link: ${videos[i].url}\n`;
            }

            text += "\nPowered by DARKHEART-MD";

            await sock.sendMessage(from, { image: { url: videos[0].thumbnail }, caption: text }, { quoted: msg });
        } catch (error) {
            console.error(error);
            await sock.sendMessage(from, { text: "An error occurred while searching YouTube." }, { quoted: msg });
        }
    }
};const { getVideoFromUrl } = require("../core/ytdl");
const fs = require("fs");

module.exports = {
    name: "ytvideo",
    aliases: ["ytvid", "ytv"],
    ownerOnly: false,
    async execute(sock, msg, args, { from }) {
        if (!args[0]) return await sock.sendMessage(from, { text: "Please provide a YouTube video link." }, { quoted: msg });

        const url = args[0];
        let videoPath;

        try {
            videoPath = await getVideoFromUrl(url);
            await sock.sendMessage(from, { video: { url: videoPath }, caption: "Powered by DARKHEART-MD", gifPlayback: false }, { quoted: msg });
        } catch (error) {
            console.error(error);
            await sock.sendMessage(from, { text: "An error occurred while downloading the video." }, { quoted: msg });
        } finally {
            if (videoPath && fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
        }
    }
};const { getAudioFromUrl } = require("../core/ytdl");
const fs = require("fs");

module.exports = {
    name: "ytaudio",
    aliases: ["yta", "ytaud"],
    ownerOnly: false,
    async execute(sock, msg, args, { from }) {
        if (!args[0]) return await sock.sendMessage(from, { text: "Please provide a YouTube video link." }, { quoted: msg });

        const url = args[0];
        let audioPath;

        try {
            audioPath = await getAudioFromUrl(url);
            await sock.sendMessage(from, { audio: { url: audioPath }, mimetype: "audio/mpeg" }, { ptt: false, quoted: msg });
        } catch (error) {
            console.error(error);
            await sock.sendMessage(from, { text: "An error occurred while downloading the audio." }, { quoted: msg });
        } finally {
            if (audioPath && fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
        }
    }
};
