const dotenv = require("dotenv");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { getRandomQuote } = require("../service/quoteService");

dotenv.config();

const imageURL = process.env.XANDER_IMAGE_2;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clown")
    .setDescription("I will give you a random quote at your will."),
  async execute(interaction) {
    console.debug("Requesting Xander quote...");

    try {
      const randomQuote = getRandomQuote();

      console.info("Generating embed for sending quote at will...");

      const quoteTaken = randomQuote["quote"];
      const contextTaken = randomQuote["context"];

      // quotes with the new line most likely have the quotation marks already within the quote
      const embedDescription = quoteTaken.includes("\n")
        ? '"' + quoteTaken + '"' + "\n- " + contextTaken
        : '"' + quoteTaken + '"' + " - " + contextTaken;

      const xanderEmbed = {
        color: 0xcf37ca,
        title: "Random Xander Quote",
        description: embedDescription,
        image: {
          url: imageURL,
        },
        footer: {
          text: "This bot is powered by Xander's money",
        },
      };

      console.info("Now sending quote at will...");

      await interaction.reply({ embeds: [xanderEmbed] });
    } catch (e) {
      console.error(`Error occurred when trying to do clown command: ${e}`);
    } finally {
      console.debug("Bot has now released a quote...");
    }
  },
};
