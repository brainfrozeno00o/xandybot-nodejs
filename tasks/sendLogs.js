const dotenv = require("dotenv");
const cron = require("node-cron");
const {
  getNumberOfReleasedQuotes,
  getNumberOfQuotesForRelease,
} = require("../service/quoteService");

dotenv.config();

const logChannelId = process.env.XANDY_LOG_CHANNEL_ID;
const logMessageId = process.env.MESSAGE_ID;

module.exports = {
  name: "sendLogs",
  /* eslint-disable no-undef */
  async execute(client) {
    try {
      cron.schedule("*/5 * * * *", async function() {
        console.info("Setting up log message...");
        // set up initial date
        const dateString = new Date().toLocaleString("en-SG", {
          timeZone: "Asia/Singapore",
        });
        const firstPart = "```Log at this time: " + dateString;

        // get all guilds
        const allGuilds = await client.guilds.cache.map((guild) => guild.name);

        const guildCountString =
          "Number of servers currently serving: " + allGuilds.length;
        const allGuildString = allGuilds.join("\n");
        const serverString = "Server List:\n" + allGuildString;

        // get info on the quotes
        const releasedQuotes = getNumberOfReleasedQuotes();
        const releasedQuotesString =
          "Number of quotes released in current runtime: " + releasedQuotes;

        const unreleasedQuotes = getNumberOfQuotesForRelease();
        const unreleasedQuotesString =
          "Number of quotes up for release in current runtime: " +
          unreleasedQuotes;

        // set up message here
        const logMessage =
          [
            firstPart,
            guildCountString,
            releasedQuotesString,
            unreleasedQuotesString,
            serverString,
          ].join("\n\n") + "```";

        // get message
        const logChannel = await client.channels.fetch(BigInt(logChannelId));
        const messageId = logMessageId === "" ? 0 : logMessageId;
        const message =
          messageId === 0 ? null : await logChannel.messages.fetch(messageId);

        if (message) {
          message.edit(logMessage);
        } else {
          message.send(logMessage);
          console.info(`Log Message ID: ${message.id}`);
        }
        console.info("Done sending log message...");
      });
    } catch (e) {
      console.error(
        `Error occurred while setting up task for sending logs: ${e}`
      );
    }
  },
};
