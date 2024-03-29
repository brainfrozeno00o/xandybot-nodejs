const dotenv = require("dotenv");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { overrideConsole } = require("./service/logger");
const { storeQuotesUpForRelease } = require("./service/quoteService");
const fs = require("fs");

dotenv.config();
overrideConsole(); // for custom logging only...

// setting up bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.commands = new Collection();
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

// handling commands here
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  console.info(`Setting up command: ${command.data.name}`);
  client.commands.set(command.data.name, command);
}

// handling closing for the following: SIGINT, SIGTERM, SIGQUIT
["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) =>
  process.on(signal, async () => {
    console.debug(`Bot now closing on ${signal}...`);
    try {
      await storeQuotesUpForRelease();
    } catch (e) {
      console.error(
        `Tried storing quotes up for release but an error occurred: ${e}`
      );
    } finally {
      client.destroy(); // this has no delay when closing...
      process.exit(0);
    }
  })
);

client.login(token);

