const { SlashCommandBuilder } = require("@discordjs/builders");
const { GuildMember } = require("discord.js");
const { QueueRepeatMode } = require("discord-player");

module.exports = {
  isMusic: true,
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Set loop mode of songs in the queue")
    .addIntegerOption((option) =>
      option
        .setName("mode")
        .setDescription("Loop type")
        .setRequired(true)
        // enforce limitations
        .setMinValue(0) // mode for OFF
        .setMaxValue(3) // mode for AUTOPLAY
        .addChoices(
          { name: "Off", value: QueueRepeatMode.OFF },
          { name: "Track", value: QueueRepeatMode.TRACK },
          { name: "Queue", value: QueueRepeatMode.QUEUE },
          { name: "Autoplay", value: QueueRepeatMode.AUTOPLAY }
        )
    ),
  async execute(interaction, player) {
    try {
      if (
        !(interaction.member instanceof GuildMember) ||
        !interaction.member.voice.channel
      ) {
        await interaction.reply({
          content: "You're not in a voice channel!",
          ephemeral: true,
        });
        return;
      }

      const playerChannelId = interaction.guild.members.me.voice.channelId;

      if (
        playerChannelId &&
        interaction.member.voice.channelId !== playerChannelId
      ) {
        await interaction.reply({
          content: "You're not in my voice channel!",
          ephemeral: true,
        });
        return;
      }

      await interaction.deferReply();

      const queue = player.getQueue(interaction.guildId);

      if (!queue || !queue.playing) {
        await interaction.followUp({
          content: "❌ | Nothing is being played!",
        });
        return;
      }

      const loopMode = interaction.options.getInteger("mode");
      const success = queue.setRepeatMode(loopMode);
      const mode =
        loopMode === QueueRepeatMode.TRACK
          ? "🔂"
          : loopMode === QueueRepeatMode.QUEUE
          ? "🔁"
          : "▶";

      await interaction.followUp({
        content: success
          ? `${mode} | Updated loop mode!`
          : "❌ | Could not update loop mode!",
      });
    } catch (e) {
      console.error(`There was an error in executing the "loop" command: ${e}`);
      await interaction.followUp({
        content:
          'There was a problem in executing "/loop". Xandy is now going to cry.',
      });
    }
  },
};
