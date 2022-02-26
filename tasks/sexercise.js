const cron = require("node-cron");
const dotenv = require("dotenv");

dotenv.config();
const twitchLink = process.env.TWITCH_LINK;

module.exports = {
    name: "sexercise",
    async execute(client) {
        try {
            // 9 PM GMT+8
            cron.schedule("0 13 * * *", async function() {
                await client.user.setPresence({
                    activities: [
                      {
                        name: "Sexercise",
                        url: twitchLink,
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