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

const getTopVotedOption = async (message, interaction) => {
  const initialResults = await Promise.all(
    message.reactions.cache.map(async (reaction) => {
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

      return {
        emoji: emojiName,
        count: reactionCount,
        reactors: reactionUsernames,
      };
    })
  );

  return initialResults.filter(
    (item) =>
      item.count === Math.max(...initialResults.map((result) => result.count))
  );
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
      "Default = 900 secs. Minimum = 300 secs. Polls have a 3-second buffer for calculating results."
    )
    .setMinValue(300)
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
        title: `Poll Question: ${question}`,
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
          const originalEmbed = pollMessage.embeds[0];
          const computingResultsEmbed = {
            title: "Computing poll results...",
            footer: {
              text: "This bot is powered by Xander's money",
            },
          };

          await pollMessage.edit({
            embeds: [computingResultsEmbed],
            components: [],
          });

          const finalResults = await getTopVotedOption(
            pollMessage,
            interaction
          );

          const finalEmbed = EmbedBuilder.from(originalEmbed)
            .setDescription(
              finalResults.length > 1
                ? `Closed by ${interaction.member.user.tag}, see top options below!`
                : `Closed by ${interaction.member.user.tag}, see top option below!`
            )
            .spliceFields(0, options.length)
            .addFields(
              finalResults.map((result) => {
                const option = options.find(
                  (item) => item.emoji === result.emoji
                );

                return {
                  name:
                    result.count > 1
                      ? `${option.emoji}  - ${option.option} (${result.count} votes)`
                      : `${option.emoji}  - ${option.option} (1 vote)`,
                  value:
                    result.count > 0
                      ? `Voted by: ${result.reactors}`
                      : `Voted by no one...`,
                };
              })
            );

          pollEnded = true;

          await reactionCollector.stop(
            `${interaction.member.user.tag} has opted to cancel the poll!`
          );

          await buttonCollector.stop(
            `${interaction.member.user.tag} has opted to cancel the poll!`
          );

          await pollMessage.edit({
            embeds: [finalEmbed],
            components: [],
          });
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
          const originalEmbed = pollMessage.embeds[0];

          const computingResultsEmbed = {
            title: "Computing poll results...",
            footer: {
              text: "This bot is powered by Xander's money",
            },
          };

          await pollMessage.edit({
            embeds: [computingResultsEmbed],
            components: [],
          });

          const finalResults = await getTopVotedOption(
            pollMessage,
            interaction
          );

          const finalEmbed = EmbedBuilder.from(originalEmbed)
            .setDescription(
              finalResults.length > 1
                ? `Voting's over, see top options below!`
                : `Voting's over, see top option below!`
            )
            .spliceFields(0, options.length)
            .addFields(
              finalResults.map((result) => {
                const option = options.find(
                  (item) => item.emoji === result.emoji
                );

                return {
                  name:
                    result.count > 1
                      ? `${option.emoji}  - ${option.option} (${result.count} votes)`
                      : `${option.emoji}  - ${option.option} (1 vote)`,
                  value:
                    result.count > 0
                      ? `Voted by: ${result.reactors}`
                      : `Voted by no one...`,
                };
              })
            );

          await pollMessage.edit({
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
