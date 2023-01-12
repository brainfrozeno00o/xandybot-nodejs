const { SlashCommandBuilder } = require("@discordjs/builders");
const { GuildMember } = require("discord.js");

module.exports = {
  isMusic: true,
  data: new SlashCommandBuilder()
    .setName("swap")
    .setDescription("Swap song positions in the queue")
    .addIntegerOption((option) =>
      option
        .setName("track1")
        .setDescription("The first track number you want to swap")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("track2")
        .setDescription("The second track number you want to swap")
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

    // sort so the lowest number is first
    const queueNumbers = [
      interaction.options.getInteger("track1") - 1,
      interaction.options.getInteger("track2") - 1,
    ].sort((a, b) => a - b);

    if (queueNumbers[1] > queue.tracks.length) {
      await interaction.followUp({
        content: "❌ | Track number greater than queue depth!",
      });
      return;
    }

    try {
      const track2 = queue.remove(queueNumbers[1]);
      const track1 = queue.remove(queueNumbers[0]);

      queue.insert(track2, queueNumbers[0]);
      queue.insert(track1, queueNumbers[1]);

      await interaction.followUp({
        content: `✅ | Swapped **${track1}** & **${track2}**!`,
      });
    } catch (e) {
      console.error(`There was an error in executing the "swap" command: ${e}`);
      await interaction.followUp({
        content: "❌ | Something went wrong!",
      });
    }
  },
};
