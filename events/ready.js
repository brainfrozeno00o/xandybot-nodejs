const fs = require("fs");
const { authenticate, syncDatabase } = require("../db/sequelize");
const { getAllImagesFromDatabase } = require("../service/imageService");
const { getAllQuotesFromDatabase } = require("../service/quoteService");

// handling tasks here
const taskFiles = fs
  .readdirSync("./tasks")
  .filter((file) => file.endsWith(".js"));

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.debug("Bot now ready...");
    // TODO: Set presence properly depending on the time the bot is deployed
    // set presence here
    await client.user.setPresence({
      activities: [
        {
          name: "Dota 2 forever | /help",
          type: 0,
        },
      ],
      status: "online",
    });

    // TODO: Check if there is a better way to initialize connection to database before the bot is ready
    // connecting to database when bot is ready
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
