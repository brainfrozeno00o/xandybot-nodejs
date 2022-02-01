const cron = require("node-cron");

module.exports = {
    name: "sexercise",
    async execute(client) {
        try {
            cron.schedule("0 13 * * *", async function() {
                await client.user.setPresence({
                    activities: [
                      {
                        name: "Sexercise",
                        url: "https://www.twitch.tv/amouranth",
                        type: 1,
                      },
                    ],
                    status: "dnd",
                  });
            });
        } catch (e) {
            console.error(`Error occurred while setting up task for setting Sexercise status: ${e}`);
        }
    }
};