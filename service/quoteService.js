const jsonService = require("./jsonDataService");

let allQuotes,
  allQuotesRandomPool,
  randomQuoteReleaseCounter = 0,
  allQuotesLength = 0,
  unreleasedQuotes,
  released = 0;

const QUOTES_UP_FOR_RELEASE_FILEPATH = "data/unreleasedQuotes.json";

const getAllQuotesFromDatabase = async () => {
  try {
    allQuotes = await jsonService.readJsonFile("data/quotes.json");

    allQuotesLength = allQuotes.length;

    console.info(`Currently have a total of ${allQuotesLength} quotes!`);
    // getting quotes up for release
    // check first if there are already unreleased quotes
    const unreleasedQuotesFileExists = jsonService.checkJsonFile(
      QUOTES_UP_FOR_RELEASE_FILEPATH
    );

    if (unreleasedQuotesFileExists) {
      unreleasedQuotes = await jsonService.readJsonFile(
        QUOTES_UP_FOR_RELEASE_FILEPATH
      );
    }

    if (!unreleasedQuotes || unreleasedQuotes.length === 0) {
      unreleasedQuotes = allQuotes.map((quote) => {
        return {
          id: quote.id,
          incoming_quote: quote["quote"],
          incoming_context: quote["context"],
        };
      });
    }

    released = allQuotesLength - unreleasedQuotes.length;

    console.info(
      `Found a total of ${released} released quotes in the current run`
    );

    allQuotesRandomPool = allQuotes.map((quote) => {
      return {
        id: quote.id,
        quote: quote.quote,
        context: quote.context,
        released: false,
      };
    });
  } catch (e) {
    console.error(`Error while trying to get info on quotes: ${e}`);
  } finally {
    console.debug("Done trying to get all quotes");
  }
};

const getNumberOfReleasedQuotes = () => {
  return released;
};

const getNumberOfQuotesForRelease = () => {
  return unreleasedQuotes.length;
};

const getAllQuotes = () => {
  return allQuotes;
};

const getRandomQuote = () => {
  // filter out quotes that are not released yet in the random pool
  const allRandomQuotesUnreleased = allQuotesRandomPool.filter(
    (quote) => quote.released === false
  );

  const chosenRandomQuote =
    allRandomQuotesUnreleased[
      Math.floor(Math.random() * allRandomQuotesUnreleased.length)
    ];

  // set released now to true for the random pool and increment counter
  const randomIndex = allQuotesRandomPool.findIndex(
    (quote) => quote.id === chosenRandomQuote.id
  );
  allQuotesRandomPool[randomIndex].released = true;
  ++randomQuoteReleaseCounter;

  console.info("Current Random Quote Counter:", randomQuoteReleaseCounter);

  // check if all are now released; if so, then reset everything
  if (randomQuoteReleaseCounter === allQuotes.length) {
    console.info("Resetting random pool for /clown command...");

    allQuotesRandomPool.forEach((quote) => {
      quote.released = false;
    });

    randomQuoteReleaseCounter = 0;
  }

  return allQuotes[randomIndex];
};

// method involves pooling
const getRandomQuoteTask = () => {
  // getting random quote here
  const randomQuote =
    unreleasedQuotes[Math.floor(Math.random() * unreleasedQuotes.length)];
  unreleasedQuotes = unreleasedQuotes.filter(
    (quote) => quote.id !== randomQuote.id
  );

  // setting counters
  ++released;
  const upForReleaseRemaining = unreleasedQuotes.length;

  // logging purposes
  console.info(
    `Currently ${upForReleaseRemaining} quote/s remaining to be said...`
  );
  console.info(`Currently ${released} quote/s said...`);

  // pooling happens here
  if (released === allQuotesLength) {
    console.info(
      "All Xander quotes in the repository have been said... Resetting pool..."
    );

    unreleasedQuotes = allQuotes.map((quote) => {
      return {
        id: quote.id,
        incoming_quote: quote["quote"],
        incoming_context: quote["context"],
      };
    });
  }

  console.info("Successfully got a random Xander quote for the task...");

  return randomQuote;
};

const storeQuotesUpForRelease = async () => {
  console.debug("Processing quotes up for release...");

  try {
    const quotesUpForReleaseCount = getNumberOfQuotesForRelease();

    console.info(`Putting ${quotesUpForReleaseCount} quotes up for release in database...`);
    // write to JSON file
    await jsonService.writeToJsonFile(
      QUOTES_UP_FOR_RELEASE_FILEPATH,
      JSON.stringify(unreleasedQuotes, 4, "\t")
    );
  } catch (e) {
    console.error(
      `Error while trying to insert up-for-release quotes in the database: ${e}`
    );
  } finally {
    console.debug("Done processing quotes up for release...");
  }
};

module.exports = {
  getNumberOfReleasedQuotes,
  getNumberOfQuotesForRelease,
  getRandomQuote,
  getRandomQuoteTask,
  getAllQuotes,
  getAllQuotesFromDatabase,
  storeQuotesUpForRelease,
};
