const fs = require("fs");

// handling tasks here
const taskFiles = fs.readdirSync("./tasks").filter(file => file.endsWith(".js"));

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

    // executing tasks here
    for (const file of taskFiles) {
      const task = require(`../tasks/${file}`);
      console.info(`Setting up task: ${task.name}`);
      await task.execute(client);
    }
  },
};
