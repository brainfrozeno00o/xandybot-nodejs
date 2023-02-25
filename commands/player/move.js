const { SlashCommandBuilder } = require("@discordjs/builders");
const { GuildMember } = require("discord.js");

module.exports = {
  isMusic: true,
  data: new SlashCommandBuilder()
    .setName("move")
    .setDescription("Move a song position in the queue")
    .addIntegerOption((option) =>
      option
        .setName("track")
        .setDescription("The track number you want to move")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("position")
        .setDescription("The position to move it to")
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
      interaction.options.getInteger("track") - 1,
      interaction.options.getInteger("position") - 1,
    ];

    if (
      queueNumbers[0] > queue.tracks.length ||
      queueNumbers[1] > queue.tracks.length
    ) {
      await interaction.followUp({
        content: "❌ | Track number greater than queue depth!",
      });
      return;
    }

    try {
      const track = queue.remove(queueNumbers[0]);

      queue.insert(track, queueNumbers[1]);

      await interaction.followUp({
        content: `✅ | Succesfully moved **${track}**!`,
      });
    } catch (e) {
      console.error(`There was an error in executing the "move" command: ${e}`);
      await interaction.followUp({
        content: "❌ | Something went wrong!",
      });
    }
  },
};
