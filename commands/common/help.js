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

          // TODO: Fix this fucking abomination of a switch case...
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
            case "play":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "play",
                "Play any song/s you'd like and I'll play it for you!",
                "/play <search query>"
              );
              break;
            case "playtop":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "playtop",
                "Play any song/s you'd like ON TOP OF THE CURRENT QUEUE and I'll play it for you!",
                "/playtop <search query>"
              );
              break;
            case "pause":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "pause",
                "Ops ops ops! Pause the song!",
                'Nothing really. Just type "/pause"'
              );
              break;
            case "resume":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "resume",
                "Aight, let's continue the song!",
                'Nothing really. Just type "/resume"'
              );
              break;
            case "skip":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "skip",
                "Skip the current song in the queue.",
                'Nothing really. Just type "/skip"'
              );
              break;
            case "nowplaying":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "nowplaying",
                "Check the song that is currently playing.",
                'Nothing really. Just type "/nowplaying"'
              );
              break;
            case "queue":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "queue",
                "View the queue of current songs.",
                'Nothing really. Just type "/queue"'
              );
              break;
            case "shuffle":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "shuffle",
                "Shuffle the current queue!",
                'Nothing really. Just type "/shuffle"'
              );
              break;
            case "loop":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "loop",
                "Set loop mode of songs in the queue",
                "/loop <loop mode (0 for OFF, 1 for TRACK, 2 for QUEUE, 3 for AUTOPLAY)>"
              );
              break;
            case "swap":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "swap",
                "Swap song positions in the queue",
                "/swap <track1> <track2>"
              );
              break;
            case "move":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "move",
                "Move a song position in the queue",
                "/move <track> <position>"
              );
              break;
            case "volume":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "volume",
                "Adjust playing volume",
                "/volume <volume (0-200)>"
              );
              break;
            case "stop":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "stop",
                "Ops ops ops! Stop all in queue!",
                'Nothing really. Just type "/stop"'
              );
              break;
            case "remove":
              singleHelpEmbed = singleCommandEmbedBuilder(
                "remove",
                "Remove a song from the queue",
                "/remove <track number in queue>"
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
          const commandEmoji = command.isMusic ? ":notes:" : ":milk:";
          const commandData = command.data;
          return {
            name: commandData.name,
            value: `${commandEmoji} ${commandData.description}`,
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
