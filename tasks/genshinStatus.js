const cron = require("node-cron");

module.exports = {
    name: "genshinStatus",
    async execute(client) {
        try {
            cron.schedule("0 15 * * *", async function() {
                await client.user.setPresence({
                    activities: [
                      {
                        name: "with people that do not think that Yoimiya is the best | /help",
                        type: 0,
                      },
                    ],
                    status: "online",
                  });
            });
        } catch (e) {
            console.error(`Error occurred while setting up task for setting Genshin status: ${e}`);
        }
    }
};