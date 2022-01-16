module.exports = (sequelize, DataTypes) => {
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
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
    }
  );
};
