const { getInstance, Image } = require("../db/sequelize");

const sequelize = getInstance();
let allImages;

const getAllImagesFromDatabase = async () => {
  try {
    allImages = await sequelize.transaction(async (t) => {
      const images = await Image.findAll(
        {
          attributes: ["id", "image_link"],
        },
        { transaction: t }
      );

      return images;
    });
    console.info("Got all images from database!");
  } catch (e) {
    console.error(`Error while trying to get all images: ${e}`);
  }
};

getAllImagesFromDatabase();

const getAllImages = () => {
  return allImages;
};

const getRandomImage = () => {
  return allImages[Math.floor(Math.random() * allImages.length)];
};

module.exports = { getAllImages, getRandomImage };
