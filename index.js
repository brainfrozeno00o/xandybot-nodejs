const dotenv = require("dotenv");
const { Client, Intents, Collection } = require("discord.js");
const { overrideConsole } = require("./service/logger");
const { close } = require("./db/sequelize");
const { storeQuotesUpForRelease } = require("./service/quoteService");
const { importCommands } = require("./deployCommands");
const fs = require("fs");

dotenv.config();
overrideConsole(); // for custom logging only...

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
client.commands = new Collection();
const token = process.env.DISCORD_TOKEN;

// handle refreshing commands to server
importCommands();

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

// handling commands here
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  console.info(`Setting up command: ${command.data.name}`);
  client.commands.set(command.data.name, command);
}

// handling closing, SIGINT only for now...
process.on("SIGINT", async () => {
  console.debug("Bot now closing...");
  try {
    await storeQuotesUpForRelease();
  } catch (e) {
    console.error(
      `Tried storing quotes up for release but an error occurred: ${e}`
    );
  } finally {
    await close();
    client.destroy(); // this has no delay when closing...
    process.exit(0);
  }
});

client.login(token);
