const cron = require("node-cron");

module.exports = {
    name: "milkAndSteamedBananas",
    async execute(client) {
        try {
            cron.schedule("55 14 * * *", async function() {
                await client.user.setPresence({
                    activities: [
                      {
                        name: "with my milk and steamed bananas | /help",
                        type: 0,
                      },
                    ],
                    status: "dnd",
                  });
            });
        } catch (e) {
            console.error(`Error occurred while setting up task for setting foods status: ${e}`);
        }
    }
};