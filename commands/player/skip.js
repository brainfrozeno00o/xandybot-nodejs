const { SlashCommandBuilder } = require("@discordjs/builders");
const { GuildMember } = require("discord.js");

module.exports = {
  isMusic: true,
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the current song in the queue."),
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

    const currentTrack = queue.current;
    const success = queue.skip();

    await interaction.followUp({
      content: success
        ? `✅ | Skipped: **${currentTrack}**`
        : "❌ | Something went wrong!",
    });
  },
};
