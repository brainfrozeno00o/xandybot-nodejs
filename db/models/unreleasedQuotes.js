const withDateNoTz = require('sequelize-date-no-tz-postgres');

module.exports = (sequelize, SequelizeDataTypes) => {
  const DataTypes = withDateNoTz(SequelizeDataTypes);

  return sequelize.define(
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
};
