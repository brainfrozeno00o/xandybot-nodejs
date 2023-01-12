const { SlashCommandBuilder } = require("@discordjs/builders");
const { GuildMember } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  isMusic: true,
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play any song you'd like and I'll play it for you!")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Search query of the song you want to play")
        .setRequired(true)
    ),
  async execute(interaction, player) {
    const memberVoiceChannel = interaction.member.voice.channel;

    try {
      if (
        !(interaction.member instanceof GuildMember) ||
        !memberVoiceChannel
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

      const query = interaction.options.getString("query");
      const searchResult = await player
        .search(query, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        })
        .catch((e) => {
          console.error(`Error in searching a song: ${e}`);
        });

      if (!searchResult || !searchResult.tracks.length) {
        return void interaction.followUp({
          content: `Sorry, no results were found with your query: ${query}`,
        });
      }

      const queue = await player.createQueue(interaction.guild, {
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
        return void interaction.followUp({
          content: "Couldn't join your voice channel!",
        });
      }

      const gotPlaylist = searchResult.playlist;

      await interaction.followUp({
        content: `⏱ | Loading your ${gotPlaylist ? "playlist" : "track"}...`,
      });

      gotPlaylist
        ? queue.addTracks(searchResult.tracks)
        : queue.addTrack(searchResult.tracks[0]);

      if (!queue.playing) {
        await queue.play();
      }
    } catch (e) {
      console.error(`There was an error in executing the "play" command: ${e}`);
      interaction.followUp({
        content:
          'There was a problem in executing "/play". Xandy is now going to cry.',
      });
    }
  },
};
