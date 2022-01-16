const fs = require("fs");
const { authenticate } = require("../db/sequelize");

// handling tasks here
const taskFiles = fs
  .readdirSync("./tasks")
  .filter((file) => file.endsWith(".js"));

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.debug("Bot now ready...");
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

    await authenticate();

    // try {
    //   const result = await sequelize.transaction(async (t) => {
    //     const quote = await Quote.create(
    //       {
    //         quote: "Test Quote",
    //         context: "Hotdogs",
    //       },
    //       { transaction: t }
    //     );

    //     return quote;
    //   });
    //   console.info(`Created object: ${result}`);
    // } catch (e) {
    //   console.error(`Error while creating an object via a model: ${e}`);
    // }

    // executing tasks here
    for (const file of taskFiles) {
      const task = require(`../tasks/${file}`);
      console.info(`Setting up task: ${task.name}`);
      await task.execute(client);
    }
  },
};
