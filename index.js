const dotenv = require("dotenv");
const { Client, Intents, Collection } = require("discord.js");
const { overrideConsole } = require("./service/logger");
const { close } = require("./db/sequelize");
const { storeQuotesUpForRelease } = require("./service/quoteService");
const Sequelize = require("sequelize");
const { Umzug, SequelizeStorage } = require("umzug");
const fs = require("fs");

dotenv.config();
overrideConsole(); // for custom logging only...

// setup for the updated migrations happen here
const db = process.env.DB;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbServer = process.env.DB_SERVER;

const sequelize = new Sequelize(db, dbUser, dbPass, {
  host: dbServer,
  dialect: "postgres",
  logging: false,
});

const umzug = new Umzug({
  migrations: { glob: "migrations/updates/*/*.js" },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

// setting up bot
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
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
      await close(); // close connection to database
      client.destroy(); // this has no delay when closing...
      process.exit(0);
    }
  })
);

(async () => {
  try {
    console.info("Performing updated migrations...");
    await umzug.up();
  } catch (e) {
    console.error(`Error occurred in updating migration: ${e}`);
  } finally {
    console.info("Done with updating the database and now starting the bot...");
    client.login(token);
  }
})();
