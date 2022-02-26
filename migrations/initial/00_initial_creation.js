const { Sequelize } = require("sequelize");
const withDateNoTz = require("sequelize-date-no-tz-postgres");
const DataTypes = withDateNoTz(Sequelize.DataTypes);

async function up({ context }) {
  // creating all quotes table
  await context.createTable(
    "all_quotes",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      quote: {
        type: DataTypes.STRING(2048),
        allowNull: false,
      },
      context: {
        type: DataTypes.STRING(2048),
        allowNull: false,
      },
      date_created: {
        type: DataTypes.DATE_NO_TZ,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
    }
  );

  // creating quotes up for release table
  await context.createTable(
    "quotes_up_for_release",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      incoming_quote: {
        type: DataTypes.STRING(2048),
        allowNull: false,
      },
      incoming_context: {
        type: DataTypes.STRING(2048),
        allowNull: false,
      },
      date_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "quotes_up_for_release", // forcing right table name here
      timestamps: false,
    }
  );

  // creating used quotes table
  await context.createTable(
    "used_quotes",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      used_quote: {
        type: DataTypes.STRING(2048),
        allowNull: false,
      },
      used_context: {
        type: DataTypes.STRING(2048),
        allowNull: false,
      },
      date_used: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
    }
  );

  // creating images table
  await context.createTable(
    "all_images",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      image_link: {
        type: DataTypes.STRING(2048),
        allowNull: false,
      },
      date_created: {
        type: DataTypes.DATE_NO_TZ,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
    }
  );
}

async function down({ context }) {
  await context.dropAllTables();
}

module.exports = { up, down };
