module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (e) {
      console.error(
        `Error occured when executing ${interaction.commandName}: ${e}`
      );
      await interaction.reply({
        content:
          "There was an error while executing this command! Xandy is now going to cry...",
        ephemeral: true, // error message is not shown publicly; only visible to the person who executed it
      });
    }
  },
};
