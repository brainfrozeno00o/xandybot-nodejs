const {
  getInstance,
  Quote,
  UsedQuote,
  UnreleasedQuote,
} = require("../db/sequelize");

const sequelize = getInstance();
let allQuotes,
  allQuotesLength = 0,
  unreleasedQuotes,
  released = 0;

const getAllQuotesFromDatabase = async () => {
  try {
    await sequelize.transaction(async (t) => {
      // original quotes
      allQuotes = await Quote.findAll(
        {
          attributes: ["id", "quote", "context"],
        },
        { transaction: t }
      );
      // mapping properly here
      allQuotes = allQuotes.map((quote) => {
        return quote.dataValues;
      });
      allQuotesLength = allQuotes.length;
      console.info(`Found a total of ${allQuotesLength} quotes`);
      // getting quotes up for release
      unreleasedQuotes = await UnreleasedQuote.findAll(
        {
          attributes: ["id", "incoming_quote", "incoming_context"],
        },
        { transaction: t }
      );
      if (!unreleasedQuotes || unreleasedQuotes.length === 0) {
        unreleasedQuotes = allQuotes.map((quote) => {
          return {
            id: quote.id,
            incoming_quote: quote["quote"],
            incoming_context: quote["context"],
          };
        });
      } else {
        unreleasedQuotes = unreleasedQuotes.map((quote) => {
          return quote.dataValues;
        });
      }
      released = allQuotesLength - unreleasedQuotes.length;
      console.info(
        `Found a total of ${released} released quotes in the current run`
      );
    });
  } catch (e) {
    console.error(`Error while trying to get info on quotes: ${e}`);
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

// method does not involve pooling, mainly for the /clown command
const getRandomQuote = () => {
  return allQuotes[Math.floor(Math.random() * allQuotes.length)];
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
  return {
    quote: randomQuote["incoming_quote"],
    context: randomQuote["incoming_context"],
  };
};

const storeInsertedQuote = async (quote) => {
  try {
    console.info("Inserting released quote to database...");
    await sequelize.transaction(async (t) => {
      await UsedQuote.create(
        {
          used_quote: quote["quote"],
          used_context: quote["context"],
        },
        { transaction: t }
      );
    });
  } catch (e) {
    console.error(
      `Error while trying to insert used quote in the database: ${e}`
    );
  } finally {
    console.info("Done processing released quote to database...");
  }
};

const storeQuotesUpForRelease = async () => {
  console.debug("Processing quotes up for release...");
  try {
    await sequelize.transaction(async (t) => {
      await sequelize.query("DELETE FROM quotes_up_for_release", {
        transaction: t,
      });
      // bulk create here
      const unreleasedQuotesForInsertion = unreleasedQuotes.map((quote) => {
        // remove the id attribute as this is automatically set
        return {
          incoming_quote: quote["incoming_quote"],
          incoming_context: quote["incoming_context"],
        };
      });
      await UnreleasedQuote.bulkCreate(unreleasedQuotesForInsertion, {
        transaction: t,
      });
    });
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
  storeInsertedQuote,
  storeQuotesUpForRelease,
};
