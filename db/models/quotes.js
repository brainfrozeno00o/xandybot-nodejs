module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
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
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
    }
  );
};
