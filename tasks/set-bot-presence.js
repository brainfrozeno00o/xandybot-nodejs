const cron = require("node-cron");
const { readJsonFile } = require("../service/json-service");
const {
  generatePresenceData,
} = require("../generator/presence-data-generator");

module.exports = {
  name: "setBotPresence",
  async execute(client) {
    try {
      const botPresenceDataList = await readJsonFile("data/presence-data.json");

      botPresenceDataList.forEach((presenceData) => {
        const botPresenceData = generatePresenceData(
          presenceData.status,
          presenceData.activities
        );

        cron.schedule(presenceData.cron, async function() {
          await client.user.setPresence(botPresenceData);
        });
      });
    } catch (e) {
      console.error(
        `Error occurred while setting up task for setting bot presence: ${e}`
      );
    }
  },
};
