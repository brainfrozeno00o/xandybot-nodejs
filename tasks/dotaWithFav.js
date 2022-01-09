const cron = require("node-cron");

module.exports = {
    name: "dotaWithFav",
    async execute(client) {
        try {
            cron.schedule("0 18 * * *", async function() {
                await client.user.setPresence({
                    activities: [
                      {
                        name: "with Albdog <3 | /help",
                        type: 0,
                      },
                    ],
                    status: "dnd",
                  });
            });
        } catch (e) {
            console.error(`Error occurred while setting up task for setting playing with my lover status: ${e}`);
        }
    }
};