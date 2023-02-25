module.exports = {
  name: "trackAdd",
  execute(queue, track) {
    queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
  },
};
