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

      const listOfBocchiGifs =
        character === "all"
          ? getAllBocchiGifs()
          : getBocchiGifsOfACharacter(character);

      const characterName = character.split("-").map((name) => name.charAt(0).toUpperCase() + name.substr(1)).join(" ");

      const pagedEmbeds = listOfBocchiGifs.map((gif) => {
        return {
          color: 0xcf37ca,
          title: characterName === "All" ? "All GIFs of all characters!" : `GIFs of ${characterName}`,
          description: `Choose the GIF you want to send by clicking on "Send GIF!" or cancel choosing by clicking on "Nope!". You roughly have a minute to choose!`,
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
          .setLabel("Previous GIF")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("send")
          .setLabel("Send GIF!")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("cancel")
          .setLabel("Nope!")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Next GIF")
          .setStyle(ButtonStyle.Primary),
      );

      let chosenGif = false;
      let gifIndex = 0;
      const maxIndex = pagedEmbeds.length - 1;

      const choosingGifMessage = await interaction.reply({
        embeds: [pagedEmbeds[gifIndex]],
        components: [row],
        ephemeral: true,
        fetchReply: true,
      });

      const buttonCollector = choosingGifMessage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 60000,
      });

      buttonCollector.on("collect", async (action) => {
        await action.deferUpdate();

        if (action.customId === "previous" || action.customId === "next") {
          if (action.customId === "previous") {
            gifIndex = (gifIndex === 0) ? maxIndex : --gifIndex;
          } else {
            gifIndex = (gifIndex === maxIndex) ? 0 : ++gifIndex;
          }

          await interaction.editReply({
            embeds: [pagedEmbeds[gifIndex]],
            components: [row],
          });
        } else if (action.customId === "cancel") {
          // it's considered "chosen" as the user who requested it at first chooses to cancel
          chosenGif = true;

          await buttonCollector.stop(
            `${interaction.member.user.tag} has opted to cancel choosing a Bocchi GIF!`
          );

          await interaction.deleteReply();
        } else if (action.customId === "send") {
          const gifLink = listOfBocchiGifs[gifIndex].link;

          await buttonCollector.stop(
            `${interaction.member.user.tag} has chosen a Bocchi GIF!`
          );

          chosenGif = true;

          await interaction.editReply({
            content: "You have now chosen a GIF! Please dismiss this message.",
            embeds: [],
            components: [],
          });

          setTimeout(async () => {
            await interaction.followUp({
              content: gifLink,
            });

            console.info("Now sending Bocchi GIF...");
          }, 500);
        }
      });

      buttonCollector.on("end", (collected) => {
        console.debug(`Collected ${collected.size} button interactions!`);
      });

      setTimeout(async () => {
        if (!chosenGif) {
          await interaction.deleteReply();
        }
      }, 60000);
    } catch (e) {
      console.error(`Error occurred when trying to do bocchi command: ${e}`);
    } finally {
      console.debug("Bot has now released a Bocchi GIF...");
    }
  },
};
