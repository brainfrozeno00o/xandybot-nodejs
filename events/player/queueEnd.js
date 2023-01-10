module.exports = {
  name: "queueEnd",
  execute(queue) {
    queue.metadata.send(
      "✅ | Queue finished!"
    );
  },
};
