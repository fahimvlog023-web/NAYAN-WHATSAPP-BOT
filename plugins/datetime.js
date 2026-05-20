module.exports = {
    config: {
        name: 'time',
        aliases: ['date', 'timeanddate', 'সময়'],
        permission: 0, // 💡 সবাই ব্যবহার করতে পারবে ভাই
        prefix: true,
        description: 'Shows live Bangladesh time, date, month, and year.',
        category: 'tools',
        usages: ['.time'],
        credit: 'Developed by Fahim Hussine'
    },

    start: async ({ event, api }) => {
        const { threadId, message } = event;

        // ─── 🇧🇩 বাংলাদেশ সময় সেট করা ───
        const options = { timeZone: 'Asia/Dhaka', hour12: true };
        const now = new Date();

        // আলাদা আলাদা ডাটা বের করা
        const hours = now.toLocaleTimeString('en-US', { ...options, hour: '2-digit', hour12: false });
        const minutes = now.toLocaleTimeString('en-US', { ...options, minute: '2-digit' });
        const seconds = now.toLocaleTimeString('en-US', { ...options, second: '2-digit' });
        
        const day = now.toLocaleDateString('en-US', { ...options, day: '2-digit' });
        const month = now.toLocaleDateString('en-US', { ...options, month: 'long' }); // মাসের পুরো নাম (যেমন: May)
        const year = now.toLocaleDateString('en-US', { ...options, year: 'numeric' });
        const weekday = now.toLocaleDateString('bn-BD', { ...options, weekday: 'long' }); // বারের নাম বাংলায় (যেমন: বুধবার)

        // ⏱️ ডিজিটাল ক্লক স্টাইল (যেমন: ০২ : ১০ : ৩৭)
        const clockStyle = `|  ${hours} : ${minutes} : ${seconds}  |`;

        // 👑 আপনার ব্র্যান্ডেড ফ্যান্সি মেসেজ ডিজাইন 👑
        let timeMsg = `👋 𝗛𝗜 🪐 —𝗙𝗮𝗵𝗶𝗺 𝗕𝗯𝘇𝓒\n\n`;
        timeMsg += `🚨 𝗔𝗞𝗢𝗡 𝗕𝗔𝗡𝗚𝗟𝗔𝗗𝗘𝗦𝗛 𝗧𝗜𝗠𝗘\n`;
        timeMsg += `┏───────────────────┓\n`;
        timeMsg += `   ${clockStyle}\n`;
        timeMsg += `┗───────────────────┛\n`;
        timeMsg += `🗓️  *𝗗𝗔𝗧𝗘 :* ${day} - ${month} - ${year}\n`;
        timeMsg += `📌  *𝗗𝗔𝗬 :* ${weekday}`;

        // গ্রুপে বা ইনবক্সে সুন্দর করে পাঠিয়ে দেওয়া
        await api.sendMessage(threadId, { text: timeMsg }, { quoted: message });
    }
};
