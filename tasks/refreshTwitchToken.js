const cron = require("node-cron");
const { authenticateTwitch } = require("../service/twitchService");

module.exports = {
  name: "refreshTwitchToken",
  // eslint-disable-next-line no-unused-vars
  async execute(client) {
    // refresh token every 12 hours
    cron.schedule("* */12 * * *", async function() {
      authenticateTwitch();
    });
  },
};
