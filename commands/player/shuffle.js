const { SlashCommandBuilder } = require("@discordjs/builders");
const { GuildMember } = require("discord.js");

const trimString = (str, max) =>
  str.length > max ? `${str.slice(0, max - 3)}...` : str;

module.exports = {
  isMusic: true,
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffle the current queue!"),
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

    try {
      queue.shuffle();
      const embed = {
        color: 0xcf37ca,
        title: "Now Playing",
        description: trimString(
          `Currently playing: 🎶 | **${queue.current.title}**!\n\n 🎶 | ${queue}!`,
          4095
        ),
        footer: {
          text: "This bot is powered by Xander's money",
        },
      };

      await interaction.followUp({
        embeds: [embed],
      });
    } catch (e) {
      console.error(
        `There was an error in executing the "shuffle" command: ${e}`
      );
      await interaction.followUp({
        content: "❌ | Something went wrong!",
      });
    }
  },
};
