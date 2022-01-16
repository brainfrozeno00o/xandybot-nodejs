module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
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
};
