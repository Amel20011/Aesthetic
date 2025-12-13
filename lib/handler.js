// lib/handler.js
import { menuCommand } from '../commands/main/menu.js';
import { config } from '../config.js';

export async function handler(sock, m) {
    if (!m.messages || m.type !== 'notify') return;
    
    const msg = m.messages[0];
    if (!msg.message) return;
    
    const from = msg.key.remoteJid;
    const text = msg.message.conversation || 
                 msg.message.extendedTextMessage?.text || '';
    const sender = msg.key.participant || msg.key.remoteJid;
    
    // Command prefix
    const prefix = '.';
    
    if (text.startsWith(prefix)) {
        const command = text.slice(prefix.length).split(' ')[0].toLowerCase();
        const args = text.slice(prefix.length + command.length).trim();
        
        // Log with aesthetic format
        console.log(`${config.emojis.flower} [CMD] ${command} from ${sender.split('@')[0]}`);
        
        switch(command) {
            case 'menu':
            case 'help':
                await menuCommand(sock, from, sender);
                break;
                
            case 'ping':
                await sock.sendMessage(from, { 
                    text: `${config.fonts.body} *PONG!* ${config.emojis.sparkle}\n` +
                          `𝗟𝗮𝘁𝗲𝗻𝗰𝘆: _${Date.now() - msg.messageTimestamp * 1000}ms_`
                });
                break;
                
            case 'owner':
                const ownerMsg = {
                    text: `${config.fonts.header}\n*👑 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢* ${config.emojis.rose}\n\n` +
                          `𝗡𝗮𝗺𝗲: ${config.ownerName}\n` +
                          `𝗡𝘂𝗺𝗯𝗲𝗿: ${config.ownerNumber}\n` +
                          `\n${config.fonts.footer}`,
                    contacts: {
                        displayName: config.ownerName,
                        contacts: [{ 
                            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${config.ownerName}\nTEL;type=CELL;type=VOICE;waid=${config.ownerNumber.replace('+', '')}:${config.ownerNumber}\nEND:VCARD`
                        }]
                    }
                };
                await sock.sendMessage(from, ownerMsg);
                break;
        }
    }
}
