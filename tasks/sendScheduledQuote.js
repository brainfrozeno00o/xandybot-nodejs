const dotenv = require("dotenv");
const cron = require("node-cron");
const { getRandomQuoteTask } = require("../service/quoteService");

dotenv.config();

const environment = process.env.ENVIRONMENT;
const imageURL = process.env.XANDER_IMAGE;

module.exports = {
  name: "sendScheduledQuote",
  async execute(client) {
    // set up needed strings depending on the environment
    const cronString =
      environment === "development" ? "*/2 * * * *" : "0 0 * * *";
    const channelName =
      environment === "development" ? "xander-bot-test-channel" : "general";

    try {
      cron.schedule(cronString, async function() {
        // get all channels needed
        console.info("Getting all channel IDs for quote sending...");

        const allChannelIds = await client.guilds.cache.map((guild) => {
          const getChannelByName = guild.channels.cache.find(
            (channel) => channel.name === channelName
          );
          return getChannelByName.id;
        });

        console.info("Done getting all channel IDs for quote sending...");

        const randomQuote = getRandomQuoteTask();

        console.info("Generating embed for sending...");

        const quoteTaken = randomQuote["incoming_quote"];
        const contextTaken = randomQuote["incoming_context"];

        // quotes with the new line most likely have the quotation marks already within the quote
        const embedDescription = quoteTaken.includes("\n")
          ? `**"${quoteTaken}"**\n- ${contextTaken}`
          : `**"${quoteTaken}"** - ${contextTaken}`;

        const xanderEmbed = {
          color: 0xcf37ca,
          title: `Xander Quote of the Day - #${randomQuote.id}`,
          description: embedDescription,
          image: {
            url: imageURL,
          },
          footer: {
            text: "This bot is powered by Xander's money",
          },
        };

        console.info(
          `Bot now sending embed message with content in all ${channelName} channels`
        );

        const message = "Hello @everyone!";

        allChannelIds.forEach(async (id) => {
          if (environment === "development") {
            const messageToDelete = await client.channels.cache.get(id).send({
              content: message,
              embeds: [xanderEmbed],
            });

            setTimeout(() => messageToDelete.delete(), 10000);
          } else {
            await client.channels.cache.get(id).send({
              content: message,
              embeds: [xanderEmbed],
            });
          }
        });

        console.info(
          `Done sending embed message in all ${channelName} channels...`
        );
      });
    } catch (e) {
      console.error(
        `Error occurred while setting up task for sending scheduled quote: ${e}`
      );
    }
  },
};
