const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const GET_TWITCH_ID_URL = "https://id.twitch.tv/oauth2/token";
const GET_STREAM_INFO_URL = "https://api.twitch.tv/helix/streams?";
const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const grantType = "client_credentials";

let bearerToken = ""; // default to empty for now

const authenticateTwitch = async () => {
  try {
    const response = await axios.post(
      `${GET_TWITCH_ID_URL}?client_id=${clientId}&client_secret=${clientSecret}&grant_type=${grantType}`
    );
    // see https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#oauth-client-credentials-flow for documentation
    if (response.data && response.data.access_token) {
      bearerToken = response.data.access_token;
    }
  } catch (e) {
    console.error(`Error while trying to get Twitch bearer token: ${e}`);
  } finally {
    console.debug("Done processing acquiring Twitch token");
  }
};

// literally fucking bad code
const checkStreamInfo = async (users) => {
  let finalRequestLink = GET_STREAM_INFO_URL;

  users.forEach((user) => {
    finalRequestLink = finalRequestLink + `user_login=${user}&`;
  });

  try {
    const response = await axios.get(finalRequestLink.slice(0, -1), {
      headers: {
        "Client-Id": clientId,
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    // see https://dev.twitch.tv/docs/api/reference#get-streams for documentation
    if (response.data) {
      return response.data.data.map((streamData) => ({
        streamTitle: streamData.title,
        thumbnail: streamData.thumbnail_url,
        userId: streamData.user_login,
        username: streamData.user_name,
        viewers: streamData.viewer_count,
      }));
    }
  } catch (e) {
    console.error(`Error while trying to get streamer access: ${e}`);
  } finally {
    console.debug("Done processing acquiring Twitch status");
  }
};

module.exports = { authenticateTwitch, checkStreamInfo };
