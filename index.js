// index.js
import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import { config } from './config.js';
import { handler } from './lib/handler.js';
import pino from 'pino';

// Logger with aesthetic formatting
const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname'
        }
    }
});

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    
    const sock = makeWASocket({
        version: [2, 2413, 1],
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ['Liviaa Bot', 'Chrome', '1.0.0']
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log('\n' + config.fonts.header + ' 𝗦𝗖𝗔𝗡 𝗤𝗥 𝗖𝗢𝗗𝗘  ' + config.fonts.footer);
            qrcode.generate(qr, { small: true });
        }
        
        if (connection === 'open') {
            logger.info(`${config.emojis.flower} Connected as ${config.botName}`);
            await sendWelcomeMessage(sock);
        }
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            logger.warn('Connection closed. Reconnecting:', shouldReconnect);
            if (shouldReconnect) connectToWhatsApp();
        }
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('messages.upsert', async (m) => {
        await handler(sock, m);
    });
}

async function sendWelcomeMessage(sock) {
    const ownerJid = config.ownerNumber.replace('+', '') + '@s.whatsapp.net';
    const welcomeMsg = {
        text: `${config.fonts.header}\n*${config.botName}* ${config.emojis.sparkle}\n\n` +
              `𝗢𝗻𝗹𝗶𝗻𝗲 𝗮𝗻𝗱 𝗿𝗲𝗮𝗱𝘆! ${config.emojis.heart}\n` +
              `𝗢𝘄𝗻𝗲𝗿: ${config.ownerName}\n${config.fonts.footer}`,
        mentions: [ownerJid]
    };
    
    await sock.sendMessage(ownerJid, welcomeMsg);
}

connectToWhatsApp().catch(err => {
    logger.error('Startup error:', err);
    process.exit(1);
});
