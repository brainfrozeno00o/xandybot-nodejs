const { SlashCommandBuilder } = require("@discordjs/builders");

const singleCommandEmbedBuilder = (command, description, format) => {
  return {
    color: 0xf1c40f,
    title: `HEEELP for ${command}`,
    fields: [
      {
        name: "Description",
        value: description,
        inline: false,
      },
      {
        name: "Command Format",
        value: format,
        inline: false,
      },
    ],
    footer: {
      text: "This bot is powered by Xander's money",
    },
  };
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("helphelphelp")
    .setDescription("Showing help in a specific command/alias or all commands")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription(
          "The command or alias that you want help in. This is not required."
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    console.debug("Requesting help from bot...");

    try {
      const input = interaction.options.getString("input");

      if (input) {
        const splitString = input
          .split(/(\s+)/)
          .filter((e) => e.trim().length > 0);
        const stringTokens = splitString.length;

        if (stringTokens > 1) {
          await interaction.reply({
            content:
              "All commands are currently only one word. Please don't try to break me. :cry:",
            ephemeral: true,
          });
        } else {
          let singleHelpEmbed;

          switch (splitString[0]) {
            case "helphelphelp":
            case "helpx3":
            case "help":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "help",
                "Showing help in a specific command or all commands, depending on whether you have an input or not respectively.",
                "/helphelphelp <command>"
              );
              break;
            case "okba":
            case "pwedeba":
            case "lgtm":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "lgtm",
                "I will try my best to say something on what you say. :sweat_smile:",
                "/lgtm <question|statement>"
              );
              break;
            case "image":
            case "xandypic":
            case "pogi":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "pogi",
                "I will send a picture of my sexy self.",
                'Nothing really. Just type "/pogi"'
              );
              break;
            case "quote":
            case "xandysays":
            case "clown":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "clown",
                "I will give you a random quote at your will. :smile:",
                'Nothing really. Just type "/clown"'
              );
              break;
            case "bocchi":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "bocchi",
                "I will give you a random GIF of a certain character from Bocchi the Rock.",
                '/bocchi <character>"'
              );
              break;
            case "poll":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "poll",
                "Create a poll with up to 10 custom options! Polls expire after 15 minutes by default but you can set a time as long as it's at least 5 minutes.",
                "/poll <question> <option-1> <option-2>"
              );
              break;
            default:
              singleHelpEmbed = {
                color: 0xe67e22,
                title: "What the hell are you looking for?!?!",
                description: `I have no clue about this command/alias: **${splitString[0]}**. Why was I not informed?!?!`,
                footer: {
                  text: "This bot is powered by Xander's money",
                },
              };
              break;
          }

          await interaction.reply({ embeds: [singleHelpEmbed] });
        }
      } else {
        // map to fields already for the embed
        const allCommands = interaction.client.commands.map((command) => {
          const commandData = command.data;
          return {
            name: commandData.name,
            value: `:milk: ${commandData.description}`,
            inline: false,
          };
        });

        // construct embed
        const generalHelpEmbed = {
          color: 0xc27c0e,
          title: "XandyBot commands",
          description:
            "So you are asking for my help? Well, here comes the help. :heart:",
          fields: allCommands,
          footer: {
            text: "This bot is powered by Xander's money",
          },
        };

        await interaction.reply({ embeds: [generalHelpEmbed] });
      }
    } catch (e) {
      console.error(`Error occurred when trying to do help command: ${e}`);
    } finally {
      console.debug("Bot has now given help...");
    }
  },
};
