module.exports = (sequelize, DataTypes) => {
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
      timestamps: false,
    }
  );
};
