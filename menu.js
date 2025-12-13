// commands/main/menu.js
import { config } from '../../config.js';

export const menuCommand = async (sock, from, sender) => {
    const { fonts, emojis } = config;
    
    const menuText = `
${fonts.header} *${config.botName}* ${emojis.sparkle} ${fonts.header}

╭┈‧₊˚✧ 𝗠𝗔𝗜𝗡 𝗠𝗘𝗡𝗨 ✧˚₊‧┈╮

${emojis.flower} *Owner Commands*
• .owner - Contact owner
• .donate - Support bot
• .status - Bot status

${emojis.clover} *Group Commands*
• .antilink - Toggle link protection
• .add - Add user to group
• .kick - Remove user
• .promote - Make admin

${emojis.heart} *Utility Commands*
• .sticker - Create sticker
• .ai - ChatGPT AI
• .tts - Text to speech
• .play - Download music

${fonts.body}
╰┈‧₊˚✧────────────✧˚₊‧┈╯

${emojis.rose} _Type .allmenu for complete commands_
${fonts.footer}
`;

    // Interactive buttons
    const buttons = [
        { buttonId: '.owner', buttonText: { displayText: `👑 Owner` }, type: 1 },
        { buttonId: '.donate', buttonText: { displayText: `💖 Donate` }, type: 1 },
        { buttonId: '.allmenu', buttonText: { displayText: `📖 Full Menu` }, type: 1 }
    ];

    const buttonMessage = {
        text: menuText,
        footer: `${config.ownerName} Bot • ${new Date().getFullYear()}`,
        buttons: buttons,
        headerType: 1,
        mentions: [sender]
    };

    await sock.sendMessage(from, buttonMessage);
};
