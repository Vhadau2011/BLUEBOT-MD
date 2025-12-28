/*
 * Copyright © 2025 Mudau Thendo (mudau_t / thendo_m)
 * This file is part of DARKHEART-MD.
 * All rights reserved. You may not modify or redistribute this file.
 * -------------------------------------------------------------------------------
 */

const os = require("os");
const { changeFont } = require("../core");
const { config, commands, prefix, secondsToHms } = require("../core");

const formatBytes = (bytes) => {
    const sizes = ["B", "KB", "MB", "GB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
};

const getRandomFont = () => "sansItalic";

module.exports = {
    name: "menu",
    description: "Displays the full list of commands or a specific category",
    execute: async (client, message, args) => {
        try {
            // Organize commands by category
            const types = {};
            commands.forEach(({ cmd, type }) => {
                if (!cmd) return;
                const main = cmd.split("|")[0].trim();
                const cat = type || "other";
                if (!types[cat]) types[cat] = [];
                types[cat].push(main);
            });

            const requestedType = args[0] ? args[0].toLowerCase() : null;
            const availableTypes = Object.keys(types).map((t) => t.toLowerCase());

            const more = String.fromCharCode(8206);
            const readmore = more.repeat(4001);

            // Show category-specific menu
            if (requestedType && availableTypes.includes(requestedType)) {
                const actualType = Object.keys(types).find(
                    (t) => t.toLowerCase() === requestedType
                );

                const categoryTitle = await changeFont(actualType.toUpperCase(), "monospace");
                const cmdList = types[actualType]
                    .map((c) => `│ ${prefix}${c.replace(/[^a-zA-Z0-9-+]/g, "")}`)
                    .join("\n");
                const formattedCmds = await changeFont(cmdList, getRandomFont());

                const final = `\`\`\`┌───── ⨺⃝Х ──────┐
 Category: ${actualType.toUpperCase()}
 Commands: ${types[actualType].length}
 Prefix: ${prefix}
└───────────────────┘\`\`\`
${readmore}

     ┏ ${categoryTitle} ┓ 
┍────── ⨺⃝Х ─────┑ 
${formattedCmds}
┕───── ⨺⃝Х ──────┙ 

Tip: Use ${prefix}menu to see all categories`;

                return client.sendMessage(message.from, { text: final });
            }

            // Show full menu
            let menuMessage = `┌─────── ⨺⃝Х ───────┐
Owner: ${config().OWNER_NAME}
Bot: ${config().BOT_NAME}
Prefix: ${prefix}
Uptime: ${await secondsToHms(process.uptime())}
└─────────────────┘
${readmore}\n`;

            const categoryList = Object.keys(types).map(async (type) => {
                const cmdList = types[type]
                    .map((c) => `│ ${prefix}${c.replace(/[^a-zA-Z0-9-+]/g, "")}`)
                    .join("\n");
                const formattedCmds = await changeFont(cmdList, getRandomFont());
                const catTitle = await changeFont(type.toUpperCase(), "monospace");

                return ` ┏ ${catTitle} ┓
┍────── ⨺⃝Х ──────┑ 
${formattedCmds}
┕────── ⨺⃝Х ──────┙`;
            });

            const resolvedCategories = await Promise.all(categoryList);
            menuMessage += resolvedCategories.join("\n\n");
            menuMessage += `\n\nTip: Use ${prefix}menu [category] for specific commands`;

            return client.sendMessage(message.from, { text: menuMessage });
        } catch (err) {
            console.error("Menu command error:", err);
            return client.sendMessage(message.from, { text: "⚠️ Failed to load menu!" });
        }
    },
};
