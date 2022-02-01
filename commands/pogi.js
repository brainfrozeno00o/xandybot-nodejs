const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pogi")
    .setDescription("I will send a picture of my sexy self."),
};
