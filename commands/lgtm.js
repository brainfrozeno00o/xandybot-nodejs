const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lgtm")
    .setDescription("I will try my best to say something on what you say.")
    .addStringOption((option) =>
      option
        .setName("statement")
        .setDescription(
          "A statement that you would like to know if it's good or not, according to Xander's wisdom."
        )
        .setRequired(true)
    ),
};
