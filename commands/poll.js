const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");

const MAX_OPTIONS = 10;
const OPTION_EMOJIS = [
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
    "🔟",
];

const pollSlashCommand = new SlashCommandBuilder()
  .setName("poll")
  .setDescription("Create a poll with your own custom options!")
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription(
        "The poll question. You need to put one for this to work!"
      )
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("option-1")
      .setDescription(
        "The first option of the poll. You need at least two options for this to work!"
      )
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("option-2")
      .setDescription(
        "The second option of the poll. You need at least two options for this to work!"
      )
      .setRequired(true)
  );

for (let i = 3; i <= MAX_OPTIONS; ++i) {
  pollSlashCommand.addStringOption((option) =>
    option
      .setName(`option-${i}`)
      .setDescription(
        i === MAX_OPTIONS
          ? "This is the last option of your poll!"
          : `Additional option of the poll. You can add ${
              MAX_OPTIONS - i
            } more option/s after this!`
      )
      .setRequired(false)
  );
}

pollSlashCommand.addIntegerOption((option) =>
  option
    .setName("close-in")
    .setDescription(
      "The number of seconds the poll will close in. By default, a poll would close in 900 seconds."
    )
    .setRequired(false)
);

module.exports = {
  data: pollSlashCommand,
  async execute(interaction) {
    console.debug("Creating poll...");

    let pollEnded = false;
    try {
      const question = interaction.options.getString("question");
      const pollCloseInSeconds =
        interaction.options.getInteger("close-in") || 900;
      const options = [];

      for (let i = 1; i <= MAX_OPTIONS; ++i) {
        const option = interaction.options.getString(`option-${i}`);

        if (option) {
          options.push(option);
        }
      }

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("close-poll")
            .setLabel("Close Poll")
            .setStyle(ButtonStyle.Danger)
        );

      console.debug(`Got statement: ${question}`);
      console.debug(`Poll would close in ${pollCloseInSeconds} seconds...`);
      options.forEach((option) => console.debug(`Added option: ${option}`));

      const pollMessage = await interaction.reply({
        content: "This is currently in progress... :tools:",
        components: [row],
        fetchReply: true,
      });

      for (let i = 0; i < options.length; ++i) {
        await pollMessage.react(`${OPTION_EMOJIS[i]}`);
      }

      const reactionFilter = (reaction, user) => {
        return OPTION_EMOJIS.includes(reaction.emoji.name) && !user.bot;
      };

      const reactionCollector = pollMessage.createReactionCollector({
        reactionFilter,
        time: pollCloseInSeconds * 1000,
        dispose: true,
      });

      reactionCollector.on("collect", async (reaction, user) => {
        // TODO: Calculate overall reactions
        console.info(`Got reaction ${reaction.emoji.name} from ${user.tag}`);
      });

      reactionCollector.on("remove", async (reaction, user) => {
        // TODO: Calculate overall reactions
        console.info(`Removed reaction ${reaction.emoji.name} by ${user.tag}`);
      });

      reactionCollector.on("end", collected => {
        console.debug(`Collected ${collected.size} reaction interactions!`);
      });

      const buttonCollector = pollMessage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: pollCloseInSeconds * 1000,
      });

      buttonCollector.on("collect", async action => {
        if (action.user.id === interaction.member.user.id) {
          // TODO: Calculate overall reactions
          pollEnded = true;

          reactionCollector.stop(`${interaction.member.user.tag} has opted to cancel the poll!`);

          await pollMessage.edit({
            content: `Poll was now closed by ${interaction.member.user.tag}!`,
            components: []
          });

          buttonCollector.stop(`${interaction.member.user.tag} has opted to cancel the poll!`);
        } else {
          await action.reply({
            content: "Sorry, you can't cancel the poll since you did not create it!",
            ephemeral: true,
          });
        }
      });

      buttonCollector.on("end", collected => {
        console.debug(`Collected ${collected.size} button interactions!`);
      });

      setTimeout(async () => {
        if (!pollEnded) {
          // TODO: Calculate overall reactions
          await pollMessage.edit({
            content: `Well, this was edited after ${pollCloseInSeconds} seconds!`,
            components: []
          });
        }
      }, pollCloseInSeconds * 1000);
    } catch (e) {
      console.error(`Error occurred when trying to do poll command: ${e}`);
    } finally {
      console.debug("Bot has now created a poll...");
    }
  },
};
