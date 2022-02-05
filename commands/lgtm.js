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
  async execute(interaction) {
    console.debug("Requesting statement from bot...");

    const affirmativeArray = ["LGTM", "Looks good to me!", "Parfait!", "Nice!"];

    const unsureArray = [
      "Tanong mo sa mama mo gago",
      "Huwag mo akong tanungin. Malungkot pa ako. :cry:",
    ];

    const negativeArray = ["Hell nah!", "We know what we do not know."];

    try {
      const statement = interaction.options.getString("statement");

      let answerEmbed;

      if (!statement) {
        console.info("Call command for what...");
        answerEmbed = {
          color: 0xcf37ca,
          title: "?",
        };
      } else {
        const randomAnswer = Math.floor(Math.random() * 3);

        let choiceArray;

        if (randomAnswer === 0) {
          choiceArray = affirmativeArray;
        } else if (randomAnswer === 1) {
          choiceArray = unsureArray;
        } else {
          choiceArray = negativeArray;
        }

        const randomResponse =
          choiceArray[Math.floor(Math.random() * choiceArray.length)];

        answerEmbed = {
          color: 0xcf37ca,
          title: statement,
          description: randomResponse,
          footer: {
            text: "This bot is powered by Xander's money",
          },
        };
      }

      await interaction.reply({ embeds: [answerEmbed] });
    } catch (e) {
      console.error(`Error occurred when trying to do lgtm command: ${e}`);
    } finally {
      console.debug("Bot has now released a statement...");
    }
  },
};
