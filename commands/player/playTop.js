const { SlashCommandBuilder } = require("@discordjs/builders");
const { GuildMember } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  isMusic: true,
  data: new SlashCommandBuilder()
    .setName("playtop")
    .setDescription("Play any song/s you'd like ON TOP OF THE CURRENT QUEUE and I'll play it for you!")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Search query of the song you want to play")
        .setRequired(true)
    ),
  async execute(interaction, player) {
    const memberVoiceChannel = interaction.member.voice.channel;

    try {
      if (!(interaction.member instanceof GuildMember) || !memberVoiceChannel) {
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

      const query = interaction.options.getString("query");
      const searchResult = await player
        .search(query, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        })
        .catch((e) => {
          console.error(`Error in searching song/s: ${e}`);
        });

      if (!searchResult || !searchResult.tracks.length) {
        await interaction.followUp({
          content: `Sorry, no results were found with your query: ${query}`,
        });
        return;
      }

      const queue = await player.createQueue(interaction.guild, {
        leaveOnEmptyCooldown: 60000,
        leaveOnStop: true,
        leaveOnEnd: false,
        initialVolume: 80,
        ytdlOptions: {
          quality: "highestaudio", // minimizing video bitrate here
          filter: "audioonly",
          highWaterMark: 1 << 30, // left shift operator - this is apparently 1024 MB, which puts a lot in the buffer
          dlChunkSize: 0, // no chunking needed, can be possible to have a value if throttling happens
        },
        metadata: interaction.channel,
      });

      try {
        if (!queue.connection) {
          await queue.connect(memberVoiceChannel);
        }
      } catch {
        void player.deleteQueue(interaction.guildId);
        await interaction.followUp({
          content: "Couldn't join your voice channel!",
        });
        return;
      }

      const gotPlaylist = searchResult.playlist;

      await interaction.followUp({
        content: `⏱ | Loading your ${gotPlaylist ? "playlist" : "track"}...`,
      });

      gotPlaylist
        ? queue.insert(searchResult.tracks, 0)
        : queue.insert(searchResult.tracks[0], 0);

      if (!queue.playing) {
        await queue.play();
      }
    } catch (e) {
      console.error(`There was an error in executing the "playtop" command: ${e}`);
      await interaction.followUp({
        content:
          'There was a problem in executing "/playtop". Xandy is now going to cry.',
      });
    }
  },
};
