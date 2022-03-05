const withDateNoTz = require("sequelize-date-no-tz-postgres");

module.exports = (sequelize, SequelizeDataTypes) => {
  const DataTypes = withDateNoTz(SequelizeDataTypes);

  return sequelize.define(
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
};
