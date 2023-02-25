module.exports = {
  name: "error",
  execute(queue, error) {
    console.error(
      `GUILD: [${queue.guild.name}] Error emitted from the queue: ${error.message}`
    );
  },
};
