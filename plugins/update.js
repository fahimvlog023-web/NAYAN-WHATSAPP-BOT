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
        credit: 'Developed by Fahim Hussain'
    },

    start: async ({ event, api }) => {
        const { threadId, message } = event;

        await api.sendMessage(threadId, { text: "🔄 GitHub theke latest code update neya hoche..." });

        // Git pull ebong automatic restart chalanor command
        exec("git pull", (error, stdout, stderr) => {
            if (error) {
                return api.sendMessage(threadId, { text: `❌ Error: ${error.message}` });
            }
            if (stderr && !stderr.includes("From github.com")) {
                return api.sendMessage(threadId, { text: `⚠️ Warning: ${stderr}` });
            }
            
            api.sendMessage(threadId, { text: `✅ GitHub pull done!\n\n${stdout}\n\n🔄 Bot restart hoche...` });
            
            // Bot automatic restart korar jonno process exit (HostingNet auto-restart korbe)
            setTimeout(() => {
                process.exit(1);
            }, 2000);
        });
    }
};
