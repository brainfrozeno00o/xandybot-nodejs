const dotenv = require("dotenv");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Player } = require("discord-player");
const { overrideConsole } = require("./service/logger");
const { storeQuotesUpForRelease } = require("./service/quoteService");
const fs = require("fs");

dotenv.config();
overrideConsole(); // for custom logging only...

// setting up bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.commands = new Collection();
const token = process.env.DISCORD_TOKEN;

// setting up Discord player
const player = new Player(client);

// helper method to get JS files, possible to create a utility class if ever
const getJSFiles = (directory) => {
  return fs.readdirSync(directory).filter((file) => file.endsWith(".js"));
};

// handling events here
const playerEventFiles = getJSFiles("./events/player");
const clientEventFiles = getJSFiles("./events/client");

for (const file of playerEventFiles) {
  const playerEvent = require(`./events/player/${file}`);
  player.on(playerEvent.name, (...args) => playerEvent.execute(...args));
}

for (const file of clientEventFiles) {
  const clientEvent = require(`./events/client/${file}`);
  if (clientEvent.once) {
    client.once(clientEvent.name, async (...args) => await clientEvent.execute(...args));
  } else {
    client.on(clientEvent.name, async (...args) => await clientEvent.execute(...args));
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

