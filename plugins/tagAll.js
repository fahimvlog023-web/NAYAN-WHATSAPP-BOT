// ─── আপনার পছন্দের কিউট স্মল-ক্যাপস ফন্ট কনভার্টার ───
function stylishFont(text) {
  const fonts = {
    'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ',
    'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ',
    'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x',
    'y': 'ʏ', 'z': 'ᴢ',
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };
  return text.toLowerCase().split('').map(char => fonts[char] || char).join('');
}

module.exports = {
    config: {
        name: 'tagall',
        aliases: ['all', 'mentionall'],
        permission: 3,
        prefix: true,
        description: 'Mentions all members of a group with stylish greetings.',
        categories: 'group',
        usages: [`${global.config.PREFIX}tagall [optional message]`],
        credit: 'Developed by Fahim hussine'
    },

    start: async ({ event, api, args }) => {
        const { threadId, senderI, message } = event;

        const groupMetadata = await api.groupMetadata(threadId);
        const participants = groupMetadata.participants || [];

        if (participants.length === 0) {
            return await api.sendMessage(threadId, { text: '⚠️ No participants found in this group.' });
        }

        const greetings = [
            "👋 Hey everyone! Ready for some fun today?",
            "🌟 Hello beautiful people! Stay awesome!",
            "😎 Yo team! Let’s make today amazing!",
            "🎉 Hi friends! Time for some group chaos 😜",
            "💖 Greetings everyone! Spread love and laughter!",
            "🔥 What’s up fam? Let’s rock this group!",
            "🥳 Hello all! Party vibes ON!",
            "😇 Hey legends! Keep smiling today!",
            "⚡ Attention everyone! Fun mode activated!",
            "🌈 Hello stars! Shine bright today!"
        ];

        let customMsg = args.join(' ');
        if (!customMsg) {
            customMsg = greetings[Math.floor(Math.random() * greetings.length)];
        }

        // ───── কিউট বক্স ও ডার্ক ব্লক ডিজাইন ─────
        let mentionText = `*╭──❒ 📢 ${stylishFont("ᴛᴀɢ ᴀʟʟ ᴍᴇᴍʙᴇʀs")} ❒*\n`;
        mentionText += `> *🎀🌴 ᴍᴇssᴀɢᴇ:* ${stylishFont(customMsg)}\n>\n`;
        mentionText += `> *👀🫶🏻 ${stylishFont("ɢʀᴏᴜᴘ ᴍᴇᴍʙᴇʀs:")}*\n`;
        
        let mentions = [];

        participants.forEach((participant, index) => {
            const tagText = ` 🎀🌴 ${index + 1}. @${participant.id.split('@')[0]} `;
            mentionText += `> *${tagText}*\n`;
            mentions.push({
                id: participant.id,
                tag: tagText.trim()
            });
        });

        mentionText += `>\n> *👀😒 ${stylishFont("ʜᴀᴠᴇ ᴀ ɢʀᴇᴀᴛ ᴅᴀʏ, ᴇᴠᴇʀʏᴏɴᴇ!")}*\n`;
        mentionText += `*╰───────────────────❒*`;

        await api.sendMessage(threadId, {
            text: mentionText,
            mentions: mentions
        }, { quoted: message });
    }
};
