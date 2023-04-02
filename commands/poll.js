const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} = require("discord.js");
const dotenv = require("dotenv");

dotenv.config();

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
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DELAY = 3;

const getTopVotedOption = (message, interaction) => {
  const overallResults = [];
  let highestReactionCount = 0;
  const messageCache = message.reactions.cache;

  messageCache.forEach(async (reaction) => {
    const emojiName = reaction.emoji.name;
    const reactionUserIds = await reaction.users.fetch();

    // excludes bot
    const reactionUsernames = await Promise.all(
      [...reactionUserIds.keys()]
        .filter((userId) => userId !== CLIENT_ID)
        .map(async (userId) => {
          const user = await interaction.client.users.fetch(userId);
          if (!user.bot) {
            return user.username;
          }
        })
    );

    const reactionCount = reactionUsernames.length;

    if (reactionCount >= highestReactionCount) {
      // only set when they're not equal
      if (reactionCount !== highestReactionCount) {
        highestReactionCount = reactionCount;
      }
      overallResults.push({
        emoji: emojiName,
        count: reactionCount,
        reactors: reactionUsernames,
      });
    }

    console.info(
      `Current Info for ${emojiName}  - ${reactionCount} with users: ${reactionUsernames}`
    );
  });

  return overallResults;
};

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
          options.push({
            emoji: `${OPTION_EMOJIS[i - 1]}`,
            option: option,
          });
        }
      }

      const closePollUnixTimestamp =
        Math.floor(Date.now() / 1000) + pollCloseInSeconds + DELAY;

      const embed = {
        color: 0xcf37ca,
        title: question,
        description: `Created by ${interaction.member.user.tag} - poll expires <t:${closePollUnixTimestamp}:R>`,
        fields: options.map((info) => {
          return {
            name: `${info.emoji}  - ${info.option}`,
            value: "",
          };
        }),
        footer: {
          text: "This bot is powered by Xander's money",
        },
      };

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("close-poll")
          .setLabel("Close Poll")
          .setStyle(ButtonStyle.Danger)
      );

      const pollMessage = await interaction.reply({
        content: "This is currently in progress... :tools:",
        embeds: [embed],
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
        console.info(`Got reaction ${reaction.emoji.name}  from ${user.tag}`);
      });

      reactionCollector.on("remove", async (reaction, user) => {
        console.info(`Removed reaction ${reaction.emoji.name}  by ${user.tag}`);
      });

      reactionCollector.on("end", (collected) => {
        console.debug(`Collected ${collected.size} reaction interactions!`);
      });

      const buttonCollector = pollMessage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: pollCloseInSeconds * 1000,
      });

      buttonCollector.on("collect", async (action) => {
        if (action.user.id === interaction.member.user.id) {
          const finalResults = getTopVotedOption(pollMessage, interaction);

          const finalEmbed = EmbedBuilder.from(pollMessage.embeds[0])
            .setDescription(
              finalResults.length > 1
                ? `Created and closed by ${interaction.member.user.tag}, see top options below!`
                : `Created and closed by ${interaction.member.user.tag}, see top option below!`
            )
            .setFields(
              finalResults.map((result) => {
                const option = options.find(
                  (item) => item.emoji === result.emoji
                );

                return {
                  name: `${option.emoji}  - ${option.option}`,
                  value:
                    result.reactors > 0
                      ? `Voted by: ${result.reactors}`
                      : `Voted by no one...`,
                };
              })
            );

          pollEnded = true;

          await reactionCollector.stop(
            `${interaction.member.user.tag} has opted to cancel the poll!`
          );

          await pollMessage.edit({
            content: "Poll is now closed!",
            embeds: [finalEmbed],
            components: [],
          });

          await buttonCollector.stop(
            `${interaction.member.user.tag} has opted to cancel the poll!`
          );
        } else {
          await action.reply({
            content:
              "Sorry, you can't cancel the poll since you did not create it!",
            ephemeral: true,
          });
        }
      });

      buttonCollector.on("end", (collected) => {
        console.debug(`Collected ${collected.size} button interactions!`);
      });

      setTimeout(async () => {
        if (!pollEnded) {
          const finalResults = getTopVotedOption(pollMessage, interaction);

          const finalEmbed = EmbedBuilder.from(pollMessage.embeds[0])
            .setDescription(
              finalResults.length > 1
                ? `Created by ${interaction.member.user.tag} - has now expired, see top options below!`
                : `Created by ${interaction.member.user.tag} - has now expired, see top option below!`
            )
            .spliceFields(0, options.length)
            .addFields(
              finalResults.map((result) => {
                const option = options.find(
                  (item) => item.emoji === result.emoji
                );

                return {
                  name: `${option.emoji}  - ${option.option}`,
                  value:
                    result.reactors > 0
                      ? `Voted by: ${result.reactors}`
                      : `Voted by no one...`,
                };
              })
            );

          // finalResults.forEach((result) => {
          //   const option = options.find(
          //     (item) => item.emoji === result.emoji
          //   );

          //   finalEmbed.addFields(
          //     {
          //       name: `${option.emoji}  - ${option.option}`,
          //       value:
          //         result.reactors > 0
          //           ? `Voted by: ${result.reactors}`
          //           : `Voted by no one...`,
          //     }
          //   );
          // });

          await pollMessage.edit({
            content: "Poll is now closed!",
            embeds: [finalEmbed],
            components: [],
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
