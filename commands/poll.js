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
const DELAY_SECONDS = 3;

const getClosePollInSeconds = (closeInString) => {
  if (!closeInString) {
    return 900;
  }

  let finalCloseInSeconds = 0;

  if (!isNaN(closeInString)) {
    finalCloseInSeconds = +closeInString;
  }

  // parse duration string here
  const daysRegex = /(\d+)\s*d(ay(s)?)?/gi;
  const hoursRegex = /(\d+)\s*h(r?(our)?s?)?/gi;
  const minutesRegex = /(\d+)\s*m(in(ute)?s?)?/gi;
  const secondsRegex = /(\d+)\s*s(ec(ond)?s?)?/gi;

  /**
   * For each time unit - In the event that there are multiple matches for each RegEx, we ONLY consider the first match!
   *
   * Say that we have the duration string of "1h 2 hours 30min 25s 30 secs", the final duration string would just be "1h 30min 25s" - which results to
   * (1 * 3600) + (30 * 60) + 25 = 5425 seconds
   */
  const daysMatches = closeInString.match(daysRegex);
  const hoursMatches = closeInString.match(hoursRegex);
  const minutesMatches = closeInString.match(minutesRegex);
  const secondsMatches = closeInString.match(secondsRegex);

  if (daysMatches) {
    finalCloseInSeconds += parseInt(daysMatches[0]) * 86400;
  }

  if (hoursMatches) {
    finalCloseInSeconds += parseInt(hoursMatches[0]) * 3600;
  }

  if (minutesMatches) {
    finalCloseInSeconds += parseInt(minutesMatches[0]) * 60;
  }

  if (secondsMatches) {
    finalCloseInSeconds += parseInt(secondsMatches[0]);
  }

  // force to return 300 seconds if it's less than 300
  return finalCloseInSeconds < 300 ? 300 : finalCloseInSeconds;
};

const getTopVotedOptions = async (message, interaction) => {
  const initialResults = await Promise.all(
    message.reactions.cache.map(async (reaction) => {
      const emojiName = reaction.emoji.name;
      const reactionUserIds = await reaction.users.fetch();
      const reactionCount = reaction.count - 1;

      // excludes bot
      const reactionUsernames = await Promise.all(
        [...reactionUserIds.keys()]
          .filter((userId) => userId !== CLIENT_ID)
          .map(async (userId) => {
            const user = await interaction.client.users.fetch(userId);
            return user.username;
          })
      );

      return {
        emoji: emojiName,
        count: reactionCount,
        usernames: reactionUsernames,
      };
    })
  );

  const maxNumberOfReacts = Math.max(
    ...initialResults.map((result) => result.count)
  );

  return initialResults.filter((item) => item.count === maxNumberOfReacts);
};

const informPollResults = async (message) => {
  console.info(`Poll ID - ${message.id} now done!`);

  await message.reply({
    content: "Hello @everyone! Results are in for this poll!",
  });
};

const generateFinalEmbed = (
  originalEmbed,
  description,
  finalResults,
  options
) => {
  return EmbedBuilder.from(originalEmbed)
    .setDescription(description)
    .setFields(
      finalResults.map((result) => {
        const option = options.find((item) => item.emoji === result.emoji);

        return {
          name:
            result.count > 1
              ? `${option.emoji}  - ${option.option} (${result.count} votes)`
              : result.count === 1
              ? `${option.emoji}  - ${option.option} (1 vote)`
              : `${option.emoji}  - ${option.option} (no votes)`,
          value:
            result.count > 0
              ? `Voted by: ${result.usernames}`
              : `Voted by no one...`,
        };
      })
    );
};

const pollSlashCommand = new SlashCommandBuilder()
  .setName("poll")
  .setDescription("Create a poll with up to 10 own custom options! Polls by default expire after 15 minutes.")
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription(
        "The poll question. You need to put one for this to work!"
      )
      .setMaxLength(1500)
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("option-1")
      .setDescription(
        "The first option of the poll. You need at least two options for this to work!"
      )
      .setMaxLength(1500)
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("option-2")
      .setDescription(
        "The second option of the poll. You need at least two options for this to work!"
      )
      .setMaxLength(1500)
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
      .setMaxLength(1500)
      .setRequired(false)
  );
}

pollSlashCommand.addStringOption((option) =>
  option
    .setName("close-in")
    .setDescription(
      "A number or a duration string (supports from days to seconds); returns minimum 5 minutes."
    )
    .setRequired(false)
);

module.exports = {
  data: pollSlashCommand,
  async execute(interaction) {
    console.debug("Creating poll...");

    let pollEnded = false;
    let duplicateOption = null;

    try {
      const question = interaction.options.getString("question");
      const pollCloseInSeconds = getClosePollInSeconds(
        interaction.options.getString("close-in")
      );
      const options = [];

      for (let i = 1; i <= MAX_OPTIONS; ++i) {
        const option = interaction.options.getString(`option-${i}`);

        if (option) {
          const optionAlreadyExists = options.length > 0 ?
            options.map((item) => item.option.trim().toLowerCase()).includes(option.trim().toLowerCase())
            : false;

          if (optionAlreadyExists) {
            duplicateOption = option;
            break;
          }

          options.push({
            emoji: `${OPTION_EMOJIS[i - 1]}`,
            option: option,
          });
        }
      }

      if (duplicateOption) {
        await interaction.reply({
          content: `You have inputted a duplicate poll option: ${duplicateOption}! Try using \`/poll\` again but this time without duplicate options.`,
          ephemeral: true,
        });

        return;
      }

      const closePollUnixTimestampSeconds =
        Math.floor(Date.now() / 1000) + pollCloseInSeconds + DELAY_SECONDS;

      const embed = {
        color: 0xcf37ca,
        title: `Poll Question: ${question}`,
        description: `Created by ${interaction.member.user.tag} - poll expires <t:${closePollUnixTimestampSeconds}:R>`,
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

      let createdPollMessageTimestampSeconds = Math.floor(pollMessage.createdTimestamp / 1000);

      const checkPollExpiryTimer = setInterval(async () => {
        if (closePollUnixTimestampSeconds - ++createdPollMessageTimestampSeconds === 60) {
          await pollMessage.reply({
            content: "Hello @everyone! This poll is about to close! React while you still can!",
          });
        }
      }, 1000);

      const originalEmbed = pollMessage.embeds[0];

      const computingResultsEmbed = {
        title: "Computing poll results...",
        footer: {
          text: "This bot is powered by Xander's money",
        },
      };

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
          clearInterval(checkPollExpiryTimer);

          await pollMessage.edit({
            embeds: [computingResultsEmbed],
            components: [],
          });

          const finalResults = await getTopVotedOptions(
            pollMessage,
            interaction
          );

          const description =
            finalResults.length > 1
              ? `Closed by ${interaction.member.user.tag}, see top options below!`
              : `Closed by ${interaction.member.user.tag}, see top option below!`;

          const finalEmbed = generateFinalEmbed(
            originalEmbed,
            description,
            finalResults,
            options
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

          await informPollResults(pollMessage);
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
        clearInterval(checkPollExpiryTimer);

        const checkPollMessage = await interaction.channel.messages.fetch(`${pollMessage.id}`);

        if (checkPollMessage && !pollEnded) {

          await pollMessage.edit({
            embeds: [computingResultsEmbed],
            components: [],
          });

          const finalResults = await getTopVotedOptions(
            pollMessage,
            interaction
          );

          const description =
            finalResults.length > 1
              ? `Voting's over, see top options below!`
              : `Voting's over, see top option below!`;

          const finalEmbed = generateFinalEmbed(
            originalEmbed,
            description,
            finalResults,
            options
          );

          await pollMessage.edit({
            embeds: [finalEmbed],
            components: [],
          });

          await informPollResults(pollMessage);
        }
      }, pollCloseInSeconds * 1000);
    } catch (e) {
      console.error(`Error occurred when trying to do poll command: ${e}`);
    } finally {
      console.debug("Bot has now created a poll...");
    }
  },
};
