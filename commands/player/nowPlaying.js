const { SlashCommandBuilder } = require("@discordjs/builders");
const { GuildMember } = require("discord.js");

module.exports = {
  isMusic: true,
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Check the song that is currently playing."),
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

    const progress = queue.createProgressBar();
    const percentage = queue.getPlayerTimestamp();

    const embed = {
      color: 0xcf37ca,
      title: "Now Playing",
      description: `🎶 | **${queue.current.title}** at ${percentage.progress}%`,
      fields: [
        {
          name: "\u200b",
          value: progress,
        },
      ],
      footer: {
        text: "This bot is powered by Xander's money",
      },
    };

    await interaction.followUp({
      embeds: [embed],
    });
  },
};
