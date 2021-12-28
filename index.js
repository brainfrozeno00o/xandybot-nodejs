const dotenv = require("dotenv");
const { Client, Intents } = require("discord.js");
const { overrideConsole } = require("./service/logger");

dotenv.config();
overrideConsole(); // for custom logging only...

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const token = process.env.DISCORD_TOKEN;

client.once("ready", () => {
  console.debug("Bot now ready...");
});

// handling closing, SIGINT only for now...
process.on("SIGINT", () => {
    console.debug("Bot now closing...");
    client.destroy(); // this has no delay when closing...
});

client.login(token);
