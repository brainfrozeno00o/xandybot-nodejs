const cron = require("node-cron");

module.exports = {
    name: "kpop",
    async execute(client) {
        try {
            // 1 AM GMT+8
            cron.schedule("0 17 * * *", async function() {
                await client.user.setPresence({
                    activities: [
                      {
                        name: "K-pop idols/trainees cry",
                        type: 3,
                      },
                    ],
                    status: "dnd",
                  });
            });
        } catch (e) {
            console.error(`Error occurred while setting up task for setting K-pop status: ${e}`);
        }
    }
};