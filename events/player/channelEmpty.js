module.exports = {
  name: "channelEmpty",
  execute(queue) {
    queue.metadata.send(
      "❌ | Leaving the voice channel as nobody is there..."
    );
  },
};
