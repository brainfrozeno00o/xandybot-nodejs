const cron = require("node-cron");
const { checkStreamInfo } = require("../service/twitchService");

module.exports = {
  name: "checkStreamStatus",
  // eslint-disable-next-line no-unused-vars
  async execute(client) {
    // run every 2 seconds
    cron.schedule("*/2 * * * * *", async function() {
      const streamers = ["amouranth", "ingvarrhf", "inomartino", "yumidesuuu"];
      // TODO: Process data from here and send to general channel
      checkStreamInfo(streamers);
    });
  },
};
