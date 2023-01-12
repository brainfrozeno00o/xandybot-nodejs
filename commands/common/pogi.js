const { SlashCommandBuilder } = require("@discordjs/builders");
const { getRandomImage } = require("../../service/imageService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pogi")
    .setDescription("I will send a picture of my sexy self."),
  async execute(interaction) {
    console.debug("Requesting handsome image from bot...");

    try {
      const message =
        "Here is a handsome picture of me. Hope you enjoy. :kissing_heart:";
      const randomImage = getRandomImage();

      await interaction.reply({
        content: message,
        files: [randomImage.image_link],
      });
    } catch (e) {
      console.error(`Error occurred when trying to do pogi command: ${e}`);
    } finally {
      console.debug("Bot has now released an image...");
    }
  },
};
