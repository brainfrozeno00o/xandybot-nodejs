const withDateNoTz = require("sequelize-date-no-tz-postgres");

module.exports = (sequelize, SequelizeDataTypes) => {
  const DataTypes = withDateNoTz(SequelizeDataTypes);

  return sequelize.define(
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
};
