const dotenv = require("dotenv");
const Sequelize = require("sequelize");

dotenv.config();

const db = process.env.DB;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbServer = process.env.DB_SERVER;

const sequelize = new Sequelize(db, dbUser, dbPass, {
  host: dbServer,
  dialect: "postgres",
  logging: false,
});

const Quote = require("./models/quotes")(sequelize, Sequelize.DataTypes);
const Image = require("./models/images")(sequelize, Sequelize.DataTypes);
const UsedQuote = require("./models/usedQuotes")(
  sequelize,
  Sequelize.DataTypes
);
const UnreleasedQuote = require("./models/unreleasedQuotes")(
  sequelize,
  Sequelize.DataTypes
);

sequelize
  .sync()
  .then(() => {
    console.info("Database synced successfully!");
  })
  .catch((e) => console.error(`Problem in syncing database: ${e}`));

const getInstance = () => {
  return sequelize;
};

const authenticate = async () => {
  try {
    await sequelize.authenticate();
    console.info("Connection has been established successfully.");
  } catch (e) {
    console.error(`Unable to connect to the database: ${e}`);
  }
};

const close = async () => {
  try {
    await sequelize.close();
    console.info("Connection has been closed successfully.");
  } catch (e) {
    console.error(`Unable to close the database: ${e}`);
  }
};

module.exports = {
  authenticate,
  close,
  getInstance,
  Image,
  Quote,
  UnreleasedQuote,
  UsedQuote,
};
