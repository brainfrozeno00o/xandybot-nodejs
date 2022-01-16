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
          return { ...quote };
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
    console.error(`Error while trying to insert used quote in database: ${e}`);
  } finally {
    console.info("Done processing released quote to database...");
  }
};

module.exports = { getAllQuotes, storeInsertedQuote };
