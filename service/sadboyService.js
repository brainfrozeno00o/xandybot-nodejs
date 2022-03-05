const { getInstance, SadboySong } = require("../db/sequelize");

const sequelize = getInstance();
let allSadboySongs,
  allSongsRandomPool,
  randomSongReleaseCounter = 0;

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
  } finally {
    allSongsRandomPool = allSadboySongs.map((song) => {
      return {
        id: song.id,
        song_name: song.song_name,
        singer: song.singer,
        song_link: song.song_link,
        released: false,
      };
    });
  }
};

const getAllSadboySongs = () => {
  return allSadboySongs;
};

const getRandomSadboySong = () => {
  // filter out songs that are not released yet in the random pool
  const allRandomSongsUnreleased = allSongsRandomPool.filter(
    (song) => song.released === false
  );

  const chosenRandomSong =
    allRandomSongsUnreleased[
      Math.floor(Math.random() * allRandomSongsUnreleased.length)
    ];

  // set released now to true for the random pool and increment counter
  const randomIndex = allSongsRandomPool.findIndex(
    (image) => image.id === chosenRandomSong.id
  );
  allSongsRandomPool[randomIndex].released = true;
  ++randomSongReleaseCounter;

  // check if all are now released; if so, then reset everything
  if (randomSongReleaseCounter === allSadboySongs.length) {
    console.info("Resetting random pool for /maye command...");
    allSongsRandomPool.forEach((song) => {
      song.released = false;
    });
    randomSongReleaseCounter = 0;
  }
  return allSadboySongs[randomIndex];
};

module.exports = {
  getAllSadboySongs,
  getRandomSadboySong,
  getAllSadboySongsFromDatabase,
};
