const cron = require("node-cron");

module.exports = {
    name: "defaultStatus",
    async execute(client) {
        try {
            // 8 AM GMT+8
            cron.schedule("0 0 * * *", async function() {
                await client.user.setPresence({
                    activities: [
                      {
                        name: "Dota 2 forever | /help",
                        type: 0,
                      },
                    ],
                    status: "online",
                  });
            });
        } catch (e) {
            console.error(`Error occurred while setting up task for setting default status: ${e}`);
        }
    }
};