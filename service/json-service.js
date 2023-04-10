const fs = require("fs");
const fsPromises = fs.promises;

const readJsonFile = async (filePath) => {
  try {
    const result = await fsPromises.readFile(filePath, "utf-8");
    return JSON.parse(result);
  } catch (e) {
    // error is most likely the file is not found
    if (e.code === "ENOENT") {
      console.error("File was not found when trying to read data");
    } else {
      console.error(`Problem in getting quotes from a JSON file: ${e.message}`);
    }
  }
};

const writeToJsonFile = async (filePath, data) => {
  // TODO: Nice to have a validation first, even the assumption of it would always pass a valid JSON string would hold true
  try {
    await fsPromises.writeFile(filePath, data);

    console.info(`Successfully wrote to ${filePath}!`);
  } catch (error) {
    console.error(
      `Error occurred when writing string to ${filePath}: ${error}`
    );
  }
};

const checkJsonFile = async (filePath) => {
  let fileExists = false;

  await fsPromises
    .access(filePath, fs.constants.F_OK)
    .then(() => (fileExists = true))
    .catch(() => console.error(`Cannot access file: ${filePath}`));

  return fileExists;
};

module.exports = { readJsonFile, writeToJsonFile, checkJsonFile };
