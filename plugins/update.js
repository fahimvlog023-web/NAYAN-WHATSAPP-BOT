const { exec } = require("child_process");

module.exports = {
    config: {
        name: 'update',
        aliases: ['gitpull', 'git'],
        permission: 3, // Shudhu owner chalaite parbe
        prefix: true,
        description: 'Pull latest code from GitHub and restart.',
        category: 'system',
        usages: ['.update'],
        credit: 'Developed by Mohammad Nayan'
    },

    start: async ({ event, api }) => {
        const { threadId, message } = event;

        await api.sendMessage(threadId, { text: "🔄 GitHub theke latest code update neya hoche..." });

        // HostingNet-er jonno safely restart command
        exec("git pull", (error, stdout, stderr) => {
            if (error) {
                return api.sendMessage(threadId, { text: `❌ Error: ${error.message}` });
            }
            
            api.sendMessage(threadId, { text: `✅ GitHub pull done!\n\n🔄 Bot safely restart hoche...` });
            
            // safely process exit output normal code (0)
            setTimeout(() => {
                process.exit(0);
            }, 2000);
        });
    }
};
