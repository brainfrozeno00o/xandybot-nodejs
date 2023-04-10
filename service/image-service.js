const { readJsonFile } = require("./json-service");

let allImages,
  allImagesRandomPool,
  randomImageReleaseCounter = 0;

const getAllImagesFromDatabase = async () => {
  try {
    allImages = await readJsonFile("data/images.json");

    console.info("Got all images from database!");

    allImagesRandomPool = allImages.map((image) => {
      return {
        id: image.id,
        image_link: image.image_link,
        released: false,
      };
    });
  } catch (e) {
    console.error(`Error while trying to get all images: ${e}`);
  } finally {
    console.debug("Done trying to get all images");
  }
};

const getAllImages = () => {
  return allImages;
};

const getRandomImage = () => {
  // filter out pictures that are not released yet in the random pool
  const allRandomImagesUnreleased = allImagesRandomPool.filter(
    (image) => image.released === false
  );

  const chosenRandomImage =
    allRandomImagesUnreleased[
      Math.floor(Math.random() * allRandomImagesUnreleased.length)
    ];

  // set released now to true for the random pool and increment counter
  const randomIndex = allImagesRandomPool.findIndex(
    (image) => image.id === chosenRandomImage.id
  );
  allImagesRandomPool[randomIndex].released = true;
  ++randomImageReleaseCounter;

  console.info("Current Random Image Counter:", randomImageReleaseCounter);

  // check if all are now released; if so, then reset everything
  if (randomImageReleaseCounter === allImages.length) {
    console.info("Resetting random pool for /pogi command...");
    allImagesRandomPool.forEach((image) => {
      image.released = false;
    });
    randomImageReleaseCounter = 0;
  }

  return allImages[randomIndex];
};

module.exports = { getAllImages, getRandomImage, getAllImagesFromDatabase };
