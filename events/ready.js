const fs = require("fs");
const { getAllImagesFromDatabase } = require("../service/image-service");
const { getAllQuotesFromDatabase } = require("../service/quote-service");
const { getAllSadboySongsFromDatabase } = require("../service/sadboy-service");
const { getAllBocchiGifsFromDatabase } = require("../service/bocchi-service");
const { authenticateTwitch } = require("../service/twitch-service");
const { readJsonFile } = require("../service/json-service");
const {
  generatePresenceData,
} = require("../generator/presence-data-generator");

// handling tasks here
const taskFiles = fs
  .readdirSync("./tasks")
  .filter((file) => file.endsWith(".js"));

// custom method for handling the proper status depending on the time the bot is deployed
const getActivity = (botPresenceDataList, readyTime) => {
  const getHours = readyTime.getHours();
  const getMinutes = readyTime.getMinutes();

  let botPresenceData;

  // bad chaining here, probably need to improve on this one
  if (getHours >= 0 && getHours < 13) {
    botPresenceData = botPresenceDataList.find(
      (presenceData) => presenceData.name === "default"
    );
  } else if (getHours === 13 || (getHours === 14 && getMinutes < 45)) {
    botPresenceData = botPresenceDataList.find(
      (presenceData) => presenceData.name === "sexercise"
    );
  } else if (getHours === 14 && getMinutes >= 45) {
    if (getMinutes >= 45 && getMinutes < 55) {
      botPresenceData = botPresenceDataList.find(
        (presenceData) => presenceData.name === "showering"
      );
    } else {
      botPresenceData = botPresenceDataList.find(
        (presenceData) => presenceData.name === "milk-and-steamed-bananas"
      );
    }
  } else if (getHours === 15) {
    botPresenceData = botPresenceDataList.find(
      (presenceData) => presenceData.name === "genshin"
    );
  } else if (getHours === 17) {
    botPresenceData = botPresenceDataList.find(
      (presenceData) => presenceData.name === "kpop"
    );
  } else {
    botPresenceData = botPresenceDataList.find(
      (presenceData) => presenceData.name === "dota-with-fav"
    );
  }

  return generatePresenceData(
    botPresenceData.status,
    botPresenceData.activities
  );
};

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.debug("Bot now ready...");

    const botPresenceDataList = await readJsonFile("data/presence-data.json");
    const activity = getActivity(botPresenceDataList, new Date(Date.now()));
    // set presence here
    await client.user.setPresence(activity);

    // Currently best to initialize connection to database once bot is ready as this will not introduce that much delay
    await getAllQuotesFromDatabase();
    await getAllImagesFromDatabase();
    await getAllSadboySongsFromDatabase();
    await getAllBocchiGifsFromDatabase();

    // get new Twitch token
    await authenticateTwitch();
    console.info("Done getting a new Twitch token...");

    // executing tasks here
    for (const file of taskFiles) {
      const task = require(`../tasks/${file}`);
      console.info(`Setting up task: ${task.name}`);
      await task.execute(client);
    }
  },
};
