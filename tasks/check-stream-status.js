const cron = require("node-cron");
const { checkStreamInfo } = require("../service/twitch-service");

// TODO: list of streamers can probably be put into a database; for now a constant list
const csBoyzStreamerNames = ["ingvarrhf", "inomartino", "yumidesuuu"];
const nsfwStreamerNames = ["amouranth"];
// set objects
const streamers = csBoyzStreamerNames
  .concat(nsfwStreamerNames)
  .map((streamer) => {
    return {
      name: streamer,
      isLive: false,
      isNsfw: nsfwStreamerNames.includes(streamer),
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
    console.info(`${streamer.name} is currently live on Twitch!`);
  } else {
    streamer.isLive = false;
  }

  return false;
};

// helper method for sending embed message
const sendEmbedMessage = async (client, id, message, embedMessage) => {
  await client.channels.cache.get(id).send({
    content: message,
    embeds: [embedMessage],
  });
};

module.exports = {
  name: "checkStreamStatus",
  async execute(client) {
    // run every 5 seconds = 12 requests per minute
    cron.schedule("*/5 * * * * *", async function() {
      // get all channels needed
      console.info(
        "Getting all channel IDs for Twitch notification sending..."
      );

      const allGeneralChannelIds = await client.guilds.cache.map((guild) => {
        const getGeneralChannelByName = guild.channels.cache.find(
          (channel) => channel.name === "general"
        );

        if (getGeneralChannelByName) {
          return getGeneralChannelByName.id;
        }
      });
      // TODO: Find a better way in doing this
      const allNsfwChannelIds = [];

      await client.guilds.cache.each((guild) => {
        const getNsfwChannelIds = guild.channels.cache
          .filter((channel) => channel.nsfw)
          .map((channel) => channel.id);

        allNsfwChannelIds.push(...getNsfwChannelIds);
      });

      console.info(
        "Done getting all channel IDs for Twitch notification sending..."
      );

      streamersLive = await checkStreamInfo(
        streamers.map((streamer) => streamer.name)
      );

      streamers.forEach((streamer) => {
        if (hasStreamerStatus(streamer)) {
          console.info(`${streamer.name} IS NOW LIVE ON TWITCH!!!`);
          const streamerInfo = streamersLive.filter(
            (streamerStatus) =>
              streamerStatus.userId.toLowerCase() === streamer.name
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

          if (streamer.isNsfw) {
            allNsfwChannelIds.forEach((id) => {
              sendEmbedMessage(client, id, message, streamEmbed);
            });
          } else {
            allGeneralChannelIds.forEach((id) => {
              sendEmbedMessage(client, id, message, streamEmbed);
            });
          }
        }
      });
    });
  },
};
