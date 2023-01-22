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
      const userInfos = new Map();
      let statement = interaction.options.getString("statement"),
        mentionedUsers,
        answerEmbed,
        mentionedMessage;

      if (statement) {
        mentionedUsers = statement.match(/<@\d+?>/g);
      }

      if (mentionedUsers) {
        // in the event of multiple users being mentioned, do this
        const userInfoResults = await Promise.all(
          mentionedUsers.map(async (mentionedId) => {
            const discordId = mentionedId.match(/\d+/g);
            const user = await interaction.client.users.fetch(`${discordId}`);
            return {
              id: user.id,
              username: user.username,
            };
          })
        );
        // push to a map so in the event of a multiple mentions of a user, there would be no duplicates
        userInfoResults.forEach((result) =>
          userInfos.set(result.id, result.username)
        );
        // replace mentions in the statement with the proper username and add them to the mentioned users message
        mentionedMessage = "You were mentioned ";
        mentionedUsers.forEach((mentionedId) => {
          const discordId = mentionedId.match(/\d+/g);
          statement = statement.replaceAll(
            `${mentionedId}`,
            userInfos.get(`${discordId}`)
          );
          mentionedMessage += `${mentionedId}, `;
        });
        // clean last few elements in the string
        mentionedMessage = mentionedMessage.slice(0, -1).replace(/.$/, "!");
      }

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

      const finalReply = mentionedUsers
        ? {
            content: mentionedMessage,
            embeds: [answerEmbed],
          }
        : { embeds: [answerEmbed] };

      await interaction.reply(finalReply);
    } catch (e) {
      console.error(`Error occurred when trying to do lgtm command: ${e}`);
    } finally {
      console.debug("Bot has now released a statement...");
    }
  },
};
