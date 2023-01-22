module.exports = {
  name: "tracksAdd",
  execute(queue, tracks) {
    queue.metadata.send(`🎶 | Tracks from playlist/album **${tracks[0].playlist.title}** queued!`);
  },
};
