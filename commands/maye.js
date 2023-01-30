const { SlashCommandBuilder } = require("@discordjs/builders");
const { getRandomSadboySong } = require("../service/sadboyService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("maye")
    .setDescription(
      "Are you feeling lonely? I will send you a song that can lighten your mood."
    ),
  async execute(interaction) {
    console.debug("Requesting sadboy song from bot...");

    try {
      const randomSadboySong = getRandomSadboySong();
      const user = await interaction.client.users.fetch(
        interaction.member.user.id
      );
      const title = `${randomSadboySong.singer} - ${randomSadboySong.song_name}`;
      const description =
        "Here is the song that would cheer you up! :kissing_heart:";
      const embed = {
        title: title,
        url: randomSadboySong.song_link,
        description: description,
      };

      await user.send({
        embeds: [embed],
      });

      await interaction.reply({
        content: "Check your DM handsome! :kissing_heart:",
        ephemeral: true,
      });
    } catch (e) {
      console.error(`Error occurred when trying to do maye command: ${e}`);
    } finally {
      console.debug("Bot about to send sadboy song...");
    }
  },
};
