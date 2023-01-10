module.exports = {
  name: "connectionCreate",
  execute(queue, connection) {
    console.info(
      `Music player connected on ${queue.guild.name}'s voice channel: ${connection.channel.name}`
    );
  },
};
