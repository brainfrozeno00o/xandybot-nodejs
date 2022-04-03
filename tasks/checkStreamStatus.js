const cron = require("node-cron");
const { checkStreamInfo } = require("../service/twitchService");

// this can probably be improved for sure
let isAmouranthLive = false;
let isIngvarrLive = false;
let isInoMartinoLive = false;
let isYumidesuLive = false;
let streamersLive = [];

// TODO: Make this dynamic
const hasStreamerStatus = (user) => {
  let isStreamerLive;
  /**
   * The idea for each case is to return true if and only if the former status of the streamer is false
   * (i.e. streamer was previously offline) and is also currently online (i.e. streamer is currently live)
   */
  switch (user) {
    case "amouranth":
      isStreamerLive = streamersLive.find(
        (status) => status.userId.toLowerCase() === "amouranth"
      );
      if (isStreamerLive) {
        if (!isAmouranthLive) {
          isAmouranthLive = true;
          return isAmouranthLive;
        }
      } else {
        isAmouranthLive = false;
      }
      return false;
    case "ingvarrhf":
      isStreamerLive = streamersLive.find(
        (status) => status.userId.toLowerCase() === "ingvarrhf"
      );
      if (isStreamerLive) {
        if (!isIngvarrLive) {
          isIngvarrLive = true;
          return isIngvarrLive;
        }
      } else {
        isIngvarrLive = false;
      }
      return false;
    case "inomartino":
      isStreamerLive = streamersLive.find(
        (status) => status.userId.toLowerCase() === "inomartino"
      );
      if (isStreamerLive) {
        if (!isInoMartinoLive) {
          isInoMartinoLive = true;
          return isInoMartinoLive;
        }
      } else {
        isInoMartinoLive = false;
      }
      return false;
    case "yumidesuuu":
      isStreamerLive = streamersLive.find(
        (status) => status.userId.toLowerCase() === "yumidesuuu"
      );
      if (isStreamerLive) {
        if (!isYumidesuLive) {
          isYumidesuLive = true;
          return isYumidesuLive;
        }
      } else {
        isYumidesuLive = false;
      }
      return false;
    default:
      break;
  }
};

module.exports = {
  name: "checkStreamStatus",
  async execute(client) {
    // get all channels needed
    console.info("Getting all channel IDs...");
    const allChannelIds = await client.guilds.cache.map((guild) => {
      const getChannelByName = guild.channels.cache.find(
        (channel) => channel.name === "general"
      );
      return getChannelByName.id;
    });
    console.info("Done getting all channel IDs...");

    // run every 5 seconds = 12 requests per minute
    cron.schedule("*/5 * * * * *", async function() {
      const streamers = ["amouranth", "ingvarrhf", "inomartino", "yumidesuuu"];
      streamersLive = await checkStreamInfo(streamers);

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
