const { Sequelize } = require("sequelize");
const withDateNoTz = require("sequelize-date-no-tz-postgres");
const DataTypes = withDateNoTz(Sequelize.DataTypes);

async function up({ context }) {
  // table for all the sadboy songs
  await context.createTable(
    "sadboy_songs",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      song_name: {
        type: DataTypes.STRING(2048),
        allowNull: false,
      },
      singer: {
        type: DataTypes.STRING(2048),
        allowNull: false,
      },
      song_link: {
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
  await context.dropTable('sadboy_songs');
}

module.exports = { up, down };
