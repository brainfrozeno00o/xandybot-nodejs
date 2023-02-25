const { SlashCommandBuilder } = require("@discordjs/builders");
const { GuildMember } = require("discord.js");

module.exports = {
  isMusic: true,
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Adjust playing volume")
    .addIntegerOption((option) =>
      option
        .setName("volume")
        .setDescription("Choose any number from 0-200")
        // enforce limitations
        .setMinValue(0)
        .setMaxValue(200)
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

    const volume = interaction.options.getInteger("volume");
    const success = queue.setVolume(volume);

    await interaction.followUp({
      content: success
        ? `🔊 | Volume set to ${volume}!`
        : "❌ | Something went wrong!",
    });
  },
};
