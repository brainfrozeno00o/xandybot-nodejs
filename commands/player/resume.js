const { SlashCommandBuilder } = require("@discordjs/builders");
const { GuildMember } = require("discord.js");

module.exports = {
  isMusic: true,
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Aight, let's continue the song!"),
  async execute(interaction, player) {
    if (
      !(interaction.member instanceof GuildMember) ||
      !interaction.member.voice.channel
    ) {
      return void interaction.reply({
        content: "You're not in a voice channel!",
        ephemeral: true,
      });
    }

    const playerChannelId = interaction.guild.members.me.voice.channelId;

    if (
      playerChannelId &&
      interaction.member.voice.channelId !== playerChannelId
    ) {
      return void interaction.reply({
        content: "You're not in my voice channel!",
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    const queue = player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) {
      return void interaction.followUp({
        content: "❌ | Nothing is being played!",
      });
    }

    const success = queue.setPaused(false);

    return void interaction.followUp({
      content: success
        ? "▶ | Resumed current song!"
        : "❌ | Something went wrong!",
    });
  },
};
