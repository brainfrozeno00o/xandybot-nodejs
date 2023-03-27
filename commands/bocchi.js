const { SlashCommandBuilder } = require("@discordjs/builders");
const { getRandomBocchiGif } = require("../service/bocchiService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bocchi")
    .setDescription(
      "I will give you a random GIF of a certain character from Bocchi the Rock."
    )
    .addStringOption((option) =>
      option
        .setName("character")
        .setDescription("The character you want a random GIF of")
        .setRequired(true)
        .addChoices(
          { name: "Bocchi (Hitori Gotoh)", value: "hitori-gotoh" },
          { name: "Ikuyo Kita", value: "ikuyo-kita" },
          { name: "Nijika Ijichi", value: "nijika-ijichi" },
          { name: "Ryo Yamada", value: "ryo-yamada" },
          { name: "Kikuri Hiroi", value: "kikuri-hiroi" },
          { name: "Seika Ijichi", value: "seika-ijichi" },
          { name: "Futari Gotoh", value: "futari-gotoh" },
          { name: "Jimihen", value: "jimihen" }
        )
    ),
  async execute(interaction) {
    console.debug("Requesting Bocchi GIF...");

    try {
      const character = interaction.options.getString("character");
      const randomCharacterGIF = getRandomBocchiGif(character)["link"];

      console.info("Now sending random Bocchi GIF...");

      await interaction.reply({ content: randomCharacterGIF });
    } catch (e) {
      console.error(`Error occurred when trying to do bocchi command: ${e}`);
    } finally {
      console.debug("Bot has now released a Bocchi GIF...");
    }
  },
};
