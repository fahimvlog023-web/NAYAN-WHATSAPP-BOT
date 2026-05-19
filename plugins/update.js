const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: 'update',
        aliases: ['gitpull', 'git', 'updateall'],
        permission: 3, // শুধু অনার চালাতে পারবে
        prefix: true,
        description: 'Download all/new commands directly from GitHub and restart.',
        category: 'system',
        usages: ['.update'],
        credit: 'Developed by Mohammad Nayan'
    },

    start: async ({ event, api }) => {
        const { threadId } = event;

        // ─── আপনার গিটহাবের সঠিক তথ্য ───
        const USERNAME = "fahimvlog023-web";
        const REPO = "FAHIM-WHATSAPP-BOT";
        const FOLDER_PATH = "commands"; // আপনার কমান্ড ফোল্ডারের নাম (commands বা plugins)

        // গিটহাবের ফোল্ডার ফাইল লিস্ট দেখার API URL
        const GITHUB_API_URL = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/${FOLDER_PATH}`;

        await api.sendMessage(threadId, { text: "🔄 GitHub এর ফোল্ডার স্ক্যান করে নতুন ফাইল খোঁজা হচ্ছে..." });

        try {
            // গিটহাব থেকে ফোল্ডারের ভেতরের সব ফাইলের লিস্ট আনা
            const folderResponse = await axios.get(GITHUB_API_URL, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });

            if (!Array.isArray(folderResponse.data)) {
                return await api.sendMessage(threadId, { text: "❌ Error: গিটহাব ফোল্ডার থেকে কোনো ফাইলের তথ্য পাওয়া যায়নি!" });
            }

            let updatedCount = 0;
            const targetDir = __dirname; // বর্তমান কমান্ড ফোল্ডারের পাথ

            // লুপ চালিয়ে প্রতিটি ফাইল ডাউনলোড করা
            for (const file of folderResponse.data) {
                if (file.type === "file" && file.name.endsWith(".js")) {
                    const fileRawUrl = file.download_url;
                    const localFilePath = path.join(targetDir, file.name);

                    // ফাইলটি ডাউনলোড করা হচ্ছে
                    const fileDataResponse = await axios.get(fileRawUrl);
                    
                    // ফাইল সেভ করা হচ্ছে (নতুন ফাইল হলে তৈরি হবে, পুরনো হলে আপডেট হবে)
                    fs.writeFileSync(localFilePath, fileDataResponse.data, "utf8");
                    updatedCount++;
                }
            }

            await api.sendMessage(threadId, { 
                text: `✅ সফলভাবে মোট ${updatedCount}টি ফাইল গিটহাব থেকে আপডেট/ডাউনলোড করা হয়েছে!\n\n🔄 নতুন সব কমান্ড চালু করার জন্য বট রিস্টার্ট হচ্ছে...` 
            });

            // হোস্টিং নেট সার্ভার সেফলি রিস্টার্ট করা
            setTimeout(() => {
                process.exit(0);
            }, 2500);

        } catch (error) {
            await api.sendMessage(threadId, { text: `❌ Error: ${error.message}\nদয়া করে আপনার গিটহাব ফোল্ডারের নাম ঠিক আছে কি না চেক করুন।` });
        }
    }
};
