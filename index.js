const dotenv = require("dotenv");
const { Client, Intents } = require("discord.js");
const { overrideConsole } = require("./service/logger");
const { close } = require("./db/sequelize");
const fs = require("fs");

dotenv.config();
overrideConsole(); // for custom logging only...

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const token = process.env.DISCORD_TOKEN;

// handling events here
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, async (...args) => await event.execute(...args));
  } else {
    client.on(event.name, async (...args) => await event.execute(...args));
  }
}

// handling closing, SIGINT only for now...
process.on("SIGINT", async () => {
  console.debug("Bot now closing...");
  await close();
  client.destroy(); // this has no delay when closing...
  process.exit(0);
});

client.login(token);
