// DO NOT RUN THIS WHEN THERE ARE EXISTING TABLES/DATA ALREADY
const dotenv = require("dotenv");
const Sequelize = require("sequelize");
const { overrideConsole } = require("./service/logger");
const { Umzug, SequelizeStorage } = require("umzug");

dotenv.config();
overrideConsole(); // for custom logging only...

const db = process.env.DB;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbServer = process.env.DB_SERVER;

const sequelize = new Sequelize(db, dbUser, dbPass, {
  host: dbServer,
  dialect: "postgres",
  logging: false,
});

const umzug = new Umzug({
  migrations: { glob: "migrations/initial/*.js" },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

(async () => {
  try {
    console.info("Performing initial migration...");
    await umzug.up();
  } catch (e) {
    console.error(`Error occurred in migration: ${e}`);
  } finally {
    console.info("Done with initial migration...");
    process.exit(0);
  }
})();
