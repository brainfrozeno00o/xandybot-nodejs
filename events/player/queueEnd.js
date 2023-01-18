module.exports = {
  name: "queueEnd",
  execute(queue) {
    console.info("Queue now finished!");
    queue.metadata.send("✅ | Queue finished!");

    if (queue.connection) {
      // wait for a minute before the bot fully leaves the voice channel it is in
      setTimeout(() => {
        queue.metadata.forceDisconnect = true;
        queue.metadata.send(
          "❌ | Leaving the voice channel as nobody has requested any song/s in about a minute"
        );
        queue.connection.disconnect();
      }, 60000);
    }
  },
};
