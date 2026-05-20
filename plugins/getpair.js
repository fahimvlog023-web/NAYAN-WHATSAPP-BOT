const axios = require('axios');

module.exports = {
    config: {
        name: 'getcode', // 💡 ডুপ্লিকেট এড়াতে একদম ইউনিক নাম
        aliases: [], // কোনো ঝামেলা ফন্ট বা অ্যালিয়াস নেই
        permission: 0, // সবাই ব্যবহার করতে পারবে ভাই
        prefix: true,
        description: 'Generates a WhatsApp pairing code instantly via high-speed public API.',
        category: 'tools',
        usages: ['.getcode 8801XXXXXXXXX'],
        credit: 'Fahim Bbz'
    },

    start: async ({ event, api, args }) => {
        const { threadId, senderId, message } = event;

        // ১. নম্বর ফিল্টার করা
        let targetNumber = args[0];
        if (!targetNumber) {
            return await api.sendMessage(threadId, { text: "❌ *দয়া করে ফোন নম্বরটি দিন ভাই!*\n\n📌 উদাহরণ: `.getcode 88017XXXXXXXX`" }, { quoted: message });
        }

        targetNumber = targetNumber.replace(/[^0-9]/g, '');

        if (targetNumber.length < 10) {
            return await api.sendMessage(threadId, { text: "❌ *ভুল নম্বর!* কান্ট্রি কোডসহ সঠিক নম্বরটি লিখুন।" }, { quoted: message });
        }

        // ওয়েটিং মেসেজ
        await api.sendMessage(threadId, { text: `🔄 @${senderId.split('@')[0]} ভাই, *FAHIM-BBZ* গ্লোবাল সার্ভার থেকে আপনার অফিশিয়াল কোড আনা হচ্ছে... একটু অপেক্ষা করুন।`, mentions: [senderId] });

        try {
            // ২. সুপারফাস্ট পাবলিক এপিআই-তে রিকোয়েস্ট (যা কখনোই ডাউন হয় না)
            const response = await axios.get(`https://bucky-official-pair-43b9db42a6be.herokuapp.com/code?number=${targetNumber}`);
            let pairingCode = response.data.code;

            if (pairingCode) {
                // কোড ফরম্যাট সুন্দর করা (যেমন: ABCD-EFGH)
                if (!pairingCode.includes('-')) {
                    pairingCode = pairingCode?.match(/.{1,4}/g)?.join("-") || pairingCode;
                }

                // 👑 আপনার শখের FAHIM-BBZ ব্র্যান্ডেড রয়্যাল বক্স মেসেজ ডিজাইন 👑
                let successMsg = `┏━━━━━━ 👑 👑 𝗥𝗢𝗬𝗔𝗟 𝗕𝗢𝗧 👑 👑 ━━━━━━┓\n\n`;
                successMsg += `  *𝗙𝗔𝗛𝗜𝗠-𝗕𝗕𝗭 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗦𝗬𝗦𝗧𝗘𝗠*\n`;
                successMsg += `  ──────────────────────────\n`;
                successMsg += `  👤 *ইউজার:* @${senderId.split('@')[0]}\n`;
                successMsg += `  📱 *নম্বর:* +${targetNumber}\n\n`;
                successMsg += `  👉 *আপনার অফিশিয়াল অ্যাক্টিভেশন কোড:*\n`;
                successMsg += `  🔥 [  *${pairingCode.toUpperCase()}* ] 🔥\n\n`;
                successMsg += `  💡 *লিঙ্ক করার নিয়ম:* হোয়াটসঅ্যাপের \n`;
                successMsg += `  *Linked Devices > Link with phone*\n`;
                successMsg += `  *number instead*-এ গিয়ে কোডটি বসান।\n`;
                successMsg += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;

                return await api.sendMessage(threadId, { text: successMsg, mentions: [senderId] }, { quoted: message });
            } else {
                throw new Error("No code");
            }

        } catch (err) {
            // ৩. যদি কোনো কারণে প্রথম এপিআই স্লো হয়, তবে ব্যাকআপ আরেকটি এপিআই ইনস্ট্যান্ট রান হবে
            try {
                const backupResponse = await axios.get(`https://api.giftedtech.my.id/api/bot/pair?number=${targetNumber}`);
                let backupCode = backupResponse.data.results?.code || backupResponse.data.code;

                if (backupCode) {
                    if (!backupCode.includes('-')) backupCode = backupCode?.match(/.{1,4}/g)?.join("-") || backupCode;

                    let successMsg = `┏━━━━━━ 👑 👑 𝗥𝗢𝗬𝗔𝗟 𝗕𝗢𝗧 👑 👑 ━━━━━━┓\n\n`;
                    successMsg += `  *𝗙𝗔𝗛𝗜𝗠-𝗕𝗕𝗭 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗦𝗬𝗦𝗧𝗘𝗠*\n`;
                    successMsg += `  ──────────────────────────\n`;
                    successMsg += `  👤 *ইউজার:* @${senderId.split('@')[0]}\n`;
                    successMsg += `  📱 *নম্বর:* +${targetNumber}\n\n`;
                    successMsg += `  👉 *আপনার অফিশিয়াল অ্যাক্টিভেশন কোড:*\n`;
                    successMsg += `  🔥 [  *${backupCode.toUpperCase()}* ] 🔥\n\n`;
                    successMsg += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;

                    return await api.sendMessage(threadId, { text: successMsg, mentions: [senderId] }, { quoted: message });
                }
            } catch (e) {}

            // দুইটা এপিআই-ই ফেল মারলে এই মেসেজ যাবে
            await api.sendMessage(threadId, { text: "❌ *দুঃখিত ভাই!* হোয়াটসঅ্যাপের মেইন সার্ভার এই মুহূর্তে ওভারলোডড। দয়া করে ১ মিনিট পর আবার চেষ্টা করুন।" }, { quoted: message });
        }
    }
};
