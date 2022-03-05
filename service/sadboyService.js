const { getInstance, SadboySong } = require("../db/sequelize");

const sequelize = getInstance();
let allSadboySongs;

const getAllSadboySongsFromDatabase = async () => {
  try {
    allSadboySongs = await sequelize.transaction(async (t) => {
      const sadboySongs = await SadboySong.findAll(
        {
          attributes: ["id", "song_name", "singer", "song_link"],
        },
        { transaction: t }
      );

      return sadboySongs;
    });
    console.info("Got all sadboy songs from database!");
  } catch (e) {
    console.error(`Error while trying to get all sadboy songs: ${e}`);
  }
};

const getAllSadboySongs = () => {
  return allSadboySongs;
};

const getRandomSadboySong = () => {
  return allSadboySongs[Math.floor(Math.random() * allSadboySongs.length)];
};

module.exports = {
  getAllSadboySongs,
  getRandomSadboySong,
  getAllSadboySongsFromDatabase,
};
