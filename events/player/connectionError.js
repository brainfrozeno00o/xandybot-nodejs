module.exports = {
  name: "connectionError",
  execute(queue, error) {
    console.error(
      `GUILD: [${queue.guild.name}] Error emitted from the connection: ${error.message}`
    );
  },
};
