const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clown")
    .setDescription("I will give you a random quote at your will."),
};
