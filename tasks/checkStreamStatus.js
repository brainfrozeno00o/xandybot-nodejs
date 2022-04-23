const cron = require("node-cron");
const { checkStreamInfo } = require("../service/twitchService");

// TODO: list of streamers can probably be put into a database; for now a constant list
const streamerNames = ["amouranth", "ingvarrhf", "inomartino", "yumidesuuu"];
// set objects
const streamers = streamerNames.map((streamer) => {
  return {
    name: streamer,
    isLive: false,
  };
});
let streamersLive = [];

const hasStreamerStatus = (streamer) => {
  const isStreamerLive = streamersLive.find(
    (status) => status.userId.toLowerCase() === streamer.name
  );
  /**
   * The idea is to return true if and only if the former status of the streamer is false
   * (i.e. streamer was previously offline) and is also currently online (i.e. streamer is currently live)
   */
  if (isStreamerLive) {
    if (!streamer.isLive) {
      streamer.isLive = true;
      return true;
    }
  } else {
    streamer.isLive = false;
  }

  return false;
};

module.exports = {
  name: "checkStreamStatus",
  async execute(client) {
    // get all channels needed
    console.info("Getting all channel IDs for Twitch notification sending...");
    const allChannelIds = await client.guilds.cache.map((guild) => {
      const getChannelByName = guild.channels.cache.find(
        (channel) => channel.name === "general"
      );
      return getChannelByName.id;
    });
    console.info(
      "Done getting all channel IDs for Twitch notification sending..."
    );

    // run every 5 seconds = 12 requests per minute
    cron.schedule("*/5 * * * * *", async function() {
      streamersLive = await checkStreamInfo(
        streamers.map((streamer) => streamer.name)
      );

      streamers.forEach((streamer) => {
        if (hasStreamerStatus(streamer)) {
          console.info(`${streamer} IS CURRENTLY ONLINE ON TWITCH!!!`);
          const streamerInfo = streamersLive.filter(
            (streamerStatus) => streamerStatus.userId.toLowerCase() === streamer
          )[0];
          const message = `Hello @everyone! ${streamerInfo.username} is live on Twitch. Check out the stream now!!!`;
          const streamImageURL = streamerInfo.thumbnail
            .replace("{width}", "500")
            .replace("{height}", "300");

          const streamEmbed = {
            color: 0xcf37ca,
            title: streamerInfo.streamTitle,
            url: `https://twitch.tv/${streamerInfo.userId}`,
            image: {
              url: streamImageURL,
            },
            footer: {
              text: "This bot is powered by Xander's money",
            },
          };

          allChannelIds.forEach(async (id) => {
            await client.channels.cache.get(id).send({
              content: message,
              embeds: [streamEmbed],
            });
          });
        }
      });
    });
  },
};
