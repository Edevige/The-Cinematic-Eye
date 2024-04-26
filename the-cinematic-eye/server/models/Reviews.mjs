

export default function (sequelize, DataTypes, user) {
  const review = sequelize.define(
    "Reviews",
    {
      text: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      spoiler: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      film_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }
  );

  review.belongsTo(user);

  return review;
}
