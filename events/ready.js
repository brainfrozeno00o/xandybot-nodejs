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
  },
};
