const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const dotenv = require("dotenv");

dotenv.config();

const clientId = process.env.DISCORD_CLIENT_ID;
const token = process.env.DISCORD_TOKEN;

const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(clientId), { body: commands });
  } catch (e) {
    console.error(`Error in reloading application (/) commands: ${e}`);
  } finally {
    console.log("Successfully reloaded application (/) commands.");
    process.exit(0);
  }
})();
