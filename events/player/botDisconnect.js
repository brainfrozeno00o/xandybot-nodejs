module.exports = {
  name: "botDisconnect",
  execute(queue) {
    if (!queue.metadata.forceDisconnect) {
      queue.metadata.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
    } else {
      queue.metadata.forceDisconnect = !queue.metadata.forceDisconnect;
    }
  },
};
