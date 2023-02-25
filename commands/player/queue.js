const { SlashCommandBuilder } = require("@discordjs/builders");
const { GuildMember } = require("discord.js");

const trimString = (str, max) =>
  str.length > max ? `${str.slice(0, max - 3)}...` : str;

module.exports = {
  isMusic: true,
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("View the queue of current songs."),
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

    const queue = player.getQueue(interaction.guildId);

    if (typeof queue !== "undefined") {
      const embed = {
        color: 0xcf37ca,
        title: "Now Playing",
        description: trimString(
          `Currently playing: 🎶 | **${queue.current.title}**!\n\n 🎶 | ${queue}`,
          4095
        ),
        footer: {
          text: "This bot is powered by Xander's money",
        },
      };

      await interaction.reply({
        embeds: [embed],
      });
    } else {
      await interaction.reply({
        content: "There's currently nothing in the queue!",
      });
    }
  },
};
