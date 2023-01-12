const { SlashCommandBuilder } = require("@discordjs/builders");
const { GuildMember } = require("discord.js");

module.exports = {
  isMusic: true,
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove a song from the queue")
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("The queue number you want to remove")
        .setRequired(true)
    ),
  async execute(interaction, player) {
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

    const trackNumber = interaction.options.getInteger("number") - 1;

    if (trackNumber > queue.tracks.length) {
      await interaction.followUp({
        content: "❌ | Track number greater than queue depth!",
      });
      return;
    }

    const removedTrack = queue.remove(trackNumber);

    await interaction.followUp({
      content: removedTrack
        ? `✅ | Removed **${removedTrack}**!`
        : "❌ | Something went wrong!",
    });
  },
};
