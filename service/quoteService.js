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

const setupData = async () => {
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

setupData();

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
      return { ...quote };
    });
  }

  console.info("Successfully got a random Xander quote for the task...");
  return randomQuote;
};

const storeInsertedQuote = async (quote) => {
  try {
    console.info("Inserting released quote to database...");
    // handling apostrophes here when inserting data in PostgreSQL
    const insertedQuote = quote["quote"].replace("'", "''");
    const insertedContext = quote["context"].replace("'", "''");
    await sequelize.transaction(async (t) => {
      await UsedQuote.create(
        {
          used_quote: insertedQuote,
          used_context: insertedContext,
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
        transaction: t
      });
      // bulk create here
      const unreleasedQuotesForInsertion = unreleasedQuotes.map((quote) => {
        // handling apostrophes here when inserting data in PostgreSQL
        const incomingQuote = quote["incoming_quote"].replace("'", "''");
        const incomingContext = quote["incoming_context"].replace("'", "''");
        // remove the id attribute as this is automatically set
        return {
          incoming_quote: incomingQuote,
          incoming_context: incomingContext,
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
  getRandomQuote,
  getRandomQuoteTask,
  getAllQuotes,
  storeInsertedQuote,
  storeQuotesUpForRelease,
};
