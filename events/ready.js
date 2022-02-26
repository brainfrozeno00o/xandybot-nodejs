const fs = require("fs");
const { authenticate, syncDatabase } = require("../db/sequelize");
const { getAllImagesFromDatabase } = require("../service/imageService");
const { getAllQuotesFromDatabase } = require("../service/quoteService");
const dotenv = require("dotenv");

dotenv.config();
const twitchLink = process.env.TWITCH_LINK;

// handling tasks here
const taskFiles = fs
  .readdirSync("./tasks")
  .filter((file) => file.endsWith(".js"));

// custom method for returning the common structure of an activity
const generateActivity = (name, type, status) => {
  return {
    activities: [
      {
        name: name,
        type: type,
      },
    ],
    status: status,
  };
};

// custom method for handling the proper status depending on the time the bot is deployed
const getActivity = (readyTime) => {
  const getHours = readyTime.getHours();
  const getMinutes = readyTime.getMinutes();

  // bad chaining here, probably need to improve on this one
  if (getHours >= 0 && getHours < 13) {
    return generateActivity("Dota 2 forever | /help", 0, "online");
  } else if (getHours === 13 || (getHours === 14 && getMinutes < 45)) {
    return {
      activities: [
        {
          name: "Sexercise",
          url: twitchLink,
          type: 1,
        },
      ],
      status: "dnd",
    };
  } else if (getHours === 14 && getMinutes >= 45) {
    if (getMinutes >= 45 && getMinutes < 55) {
      return generateActivity("with myself in the shower | /help", 0, "dnd");
    } else {
      return generateActivity("with my milk and steamed bananas | /help", 0, "dnd");
    }
  } else if (getHours === 15) {
    return generateActivity("with people that do not think that Yoimiya is the best | /help", 0, "online");
  } else if (getHours === 17) {
    return generateActivity("K-pop idols/trainees cry", 3, "dnd");
  } else {
    return generateActivity("with Albdog <3 | /help", 0, "dnd");
  }
};

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.debug("Bot now ready...");
    const activity = getActivity(new Date(Date.now()));
    // TODO: Set presence properly depending on the time the bot is deployed
    // set presence here
    await client.user.setPresence(activity);

    // Currently best to initialize connection to database once bot is ready as this will not introduce that much delay
    await syncDatabase();
    await authenticate();
    await getAllQuotesFromDatabase();
    await getAllImagesFromDatabase();

    // executing tasks here
    for (const file of taskFiles) {
      const task = require(`../tasks/${file}`);
      console.info(`Setting up task: ${task.name}`);
      await task.execute(client);
    }
  },
};
