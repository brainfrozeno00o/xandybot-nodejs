const cron = require("node-cron");

module.exports = {
    name: "showering",
    async execute(client) {
        try {
            // 10:45 PM GMT+8
            cron.schedule("45 14 * * *", async function() {
                await client.user.setPresence({
                    activities: [
                      {
                        name: "with myself in the shower | /help",
                        type: 0,
                      },
                    ],
                    status: "dnd",
                  });
            });
        } catch (e) {
            console.error(`Error occurred while setting up task for setting showering status: ${e}`);
        }
    }
};