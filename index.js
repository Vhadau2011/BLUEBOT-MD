require('dotenv').config();
const Baileys = require('@whiskeysockets/baileys');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    jidDecode
} = Baileys;

// Robust import for makeInMemoryStore
let makeInMemoryStore;
try {
    // Try standard export
    makeInMemoryStore = Baileys.makeInMemoryStore;
    if (!makeInMemoryStore) {
        // Try direct lib import
        makeInMemoryStore = require('@whiskeysockets/baileys/lib/Store').makeInMemoryStore;
    }
} catch (e) {
    try {
        // Try alternative export
        makeInMemoryStore = require('@whiskeysockets/baileys').makeInMemoryStore;
    } catch (e2) {
        console.error('Failed to load makeInMemoryStore:', e2);
    }
}

// Final fallback: dummy store to prevent crash
if (typeof makeInMemoryStore !== 'function') {
    console.log('Using dummy store fallback');
    makeInMemoryStore = () => ({ bind: () => {}, readFromFile: () => {}, writeToFile: () => {} });
}

const { Boom } = require('@hapi/boom');
const P = require('pino');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');

// Configuration from .env
const prefix = process.env.PREFIX || '!';
const ownerNumber = process.env.OWNER_NUMBER + '@s.whatsapp.net';
const mods = (process.env.MODS || '').split(',').map(v => v.trim() + '@s.whatsapp.net');
const botName = process.env.BOT_NAME || 'BLUEBOT-MD';

// Store for managing data in memory
const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) });

// Command Handler Setup
const commands = new Map();

function loadCommands() {
    const categories = ['Owner', 'Admin', 'Dev', 'Fun', 'Group', 'MODS', 'general'];
    categories.forEach(category => {
        const commandPath = path.join(__dirname, 'commands', category);
        if (fs.existsSync(commandPath)) {
            const files = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
            for (const file of files) {
                const command = require(path.join(commandPath, file));
                command.category = category;
                commands.set(command.name, command);
            }
        }
    });
    console.log(`Loaded ${commands.size} commands.`);
}

async function startBot() {
    const sessionName = process.env.SESSION_ID || 'default-session';
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'sessions', sessionName));
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
        browser: [botName, 'Chrome', '1.0.0']
    });

    if (store && typeof store.bind === 'function') {
        store.bind(sock.ev);
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            console.log('Scan the QR code below to connect:');
        }
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log(`${botName} is now online!`);
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        if (m.type !== 'notify') return;
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const type = Object.keys(msg.message)[0];
        const content = type === 'conversation' ? msg.message.conversation : 
                        type === 'extendedTextMessage' ? msg.message.extendedTextMessage.text : 
                        type === 'imageMessage' ? msg.message.imageMessage.caption : 
                        type === 'videoMessage' ? msg.message.videoMessage.caption : '';

        if (!content.startsWith(prefix)) return;

        const args = content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = commands.get(commandName);

        if (!command) return;

        const isOwner = from === ownerNumber || msg.key.participant === ownerNumber;
        const isMod = mods.includes(from) || mods.includes(msg.key.participant) || isOwner;
        const isDev = msg.key.participant?.includes('mudau_t') || from.includes('mudau_t');

        if (command.category === 'Owner' && !isOwner) return sock.sendMessage(from, { text: 'This command is for Owner only.' });
        if (command.category === 'MODS' && !isMod) return sock.sendMessage(from, { text: 'This command is for Mods/Owner only.' });
        if (command.category === 'Dev' && !isDev) return sock.sendMessage(from, { text: 'This command is for Developers only.' });

        try {
            await command.execute(sock, msg, args, { isOwner, isMod, isDev, prefix, store });
        } catch (error) {
            console.error(error);
            sock.sendMessage(from, { text: 'An error occurred while executing the command.' });
        }
    });
}

loadCommands();
startBot();
