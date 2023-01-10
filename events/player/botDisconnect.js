module.exports = {
  name: "botDisconnect",
  execute(queue) {
    queue.metadata.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
  },
};
