const { readJsonFile } = require("./jsonDataService");

let allBocchiGifs;

const getAllBocchiGifsFromDatabase = async () => {
  try {
    allBocchiGifs = await readJsonFile("data/bocchi.json");

    console.info("Got all Bocchi GIFs from database!");
  } catch (e) {
    console.error(`Error while trying to get all Bocchi GIFs: ${e}`);
  } finally {
    console.debug("Done trying to get all Bocchi GIFs");
  }
};

const getAllBocchiGifs = () => {
  return allBocchiGifs;
};

const getRandomBocchiGif = (character) => {
  const allCharacterGifs = allBocchiGifs.filter((gif) =>
    gif["tags"].includes(character)
  );

  const chosenCharacterGif =
    allCharacterGifs[Math.floor(Math.random() * allCharacterGifs.length)];

  console.info(`Found a random gif for ${character}...`);

  return chosenCharacterGif;
};

module.exports = {
  getAllBocchiGifsFromDatabase,
  getRandomBocchiGif,
  getAllBocchiGifs,
};
