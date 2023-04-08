const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const {
  getAllBocchiGifs,
  getBocchiGifsOfACharacter,
} = require("../service/bocchiService");

let currentUsers = [];

const computeGifIndex = (customId, currentGifIndex, currentMaxIndex) => {
  return customId === "previous"
    ? currentGifIndex === 0
      ? currentMaxIndex
      : --currentGifIndex
    : currentGifIndex === currentMaxIndex
    ? 0
    : ++currentGifIndex;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bocchi")
    .setDescription(
      "I will give you GIFs of characters from Bocchi the Rock. But you choose what to send!"
    )
    .addStringOption((option) =>
      option
        .setName("character")
        .setDescription(
          "The character you want to send a GIF of, but if not, you can check all first..."
        )
        .setRequired(true)
        .addChoices(
          { name: "Bocchi (Hitori Gotoh)", value: "hitori-gotoh" },
          { name: "Ikuyo Kita", value: "ikuyo-kita" },
          { name: "Nijika Ijichi", value: "nijika-ijichi" },
          { name: "Ryo Yamada", value: "ryo-yamada" },
          { name: "Kikuri Hiroi", value: "kikuri-hiroi" },
          { name: "Seika Ijichi", value: "seika-ijichi" },
          { name: "Futari Gotoh", value: "futari-gotoh" },
          { name: "Jimihen", value: "jimihen" },
          { name: "All", value: "all" }
        )
    ),
  async execute(interaction) {
    console.debug("Requesting Bocchi GIF...");

    try {
      const character = interaction.options.getString("character");
      const userTag = interaction.member.user.tag;

      const currentlyUsing = currentUsers.includes(userTag);

      const slugBocchiAnimatedEmoji = "<a:slugbocchi:1094241815139454976>";

      await interaction.reply({
        content: currentlyUsing
          ? "You are currently using the /bocchi command - either you are currently choosing a GIF or you have recently dismissed the message of choosing the GIF..."
          : `${slugBocchiAnimatedEmoji}${slugBocchiAnimatedEmoji}${slugBocchiAnimatedEmoji}`,
        ephemeral: currentlyUsing,
      });

      if (currentlyUsing) {
        return;
      }

      currentUsers.push(userTag);

      const listOfBocchiGifs =
        character === "all"
          ? getAllBocchiGifs()
          : getBocchiGifsOfACharacter(character);

      const characterName = character
        .split("-")
        .map((name) => name.charAt(0).toUpperCase() + name.substr(1))
        .join(" ");

      const pagedEmbeds = listOfBocchiGifs.map((gif) => {
        return {
          color: 0xcf37ca,
          title:
            characterName === "All"
              ? "All GIFs of all characters!"
              : `GIFs of ${characterName}`,
          description: `**If you stay idle or dismiss this message within 10 seconds, then it's over! (timer resets if you click ◀️/▶️)**\n\nChoose the GIF you want to send by clicking ✅ or cancel choosing by clicking ❌`,
          image: {
            url: gif.link,
          },
          footer: {
            text: "This bot is powered by Xander's money",
          },
        };
      });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setLabel("◀️")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("send")
          .setLabel("✅")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("cancel")
          .setLabel("❌")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("▶️")
          .setStyle(ButtonStyle.Primary)
      );

      let gifIndex = 0;
      const maxIndex = pagedEmbeds.length - 1;

      const choosingGifMessage = await interaction.followUp({
        embeds: [pagedEmbeds[gifIndex]],
        components: [row],
        ephemeral: true,
        fetchReply: true,
      });

      const buttonCollector =
        choosingGifMessage.createMessageComponentCollector({
          componentType: ComponentType.Button,
          idle: 10000,
        });

      let gifLink;

      buttonCollector.on("collect", async (action) => {
        await action.deferUpdate();

        if (action.customId === "previous" || action.customId === "next") {
          gifIndex = computeGifIndex(action.customId, gifIndex, maxIndex);

          await action.editReply({
            embeds: [pagedEmbeds[gifIndex]],
            components: [row],
          });
        } else if (action.customId === "cancel") {
          await buttonCollector.stop(
            `${userTag} has opted to cancel choosing a Bocchi GIF!`
          );
        } else if (action.customId === "send") {
          gifLink = listOfBocchiGifs[gifIndex].link;

          await buttonCollector.stop(`${userTag} has chosen a Bocchi GIF!`);
        }
      });

      buttonCollector.on("end", async (collected, reason) => {
        currentUsers = currentUsers.filter(
          (currentUserTag) => currentUserTag !== userTag
        );

        await interaction.deleteReply(choosingGifMessage);

        if (reason.includes("cancel") || reason === "idle") {
          setTimeout(async () => {
            await interaction.deleteReply();
          }, 100);
        } else if (reason.includes("chosen")) {
          setTimeout(async () => {
            await interaction.editReply({
              content: gifLink,
            });

            console.info("Now sending Bocchi GIF...");
          }, 100);
        }

        console.debug(`Collected ${collected.size} button interactions!`);
      });
    } catch (e) {
      console.error(`Error occurred when trying to do bocchi command: ${e}`);
    } finally {
      console.debug("Bot processing release of Bocchi GIF...");
    }
  },
};
