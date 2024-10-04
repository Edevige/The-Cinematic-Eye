export default function (sequelize, DataTypes, user) {
  const review = sequelize.define(
    "Reviews",
    {
      rating:{
        type: DataTypes.FLOAT,
        allowNull: false
      },
      text: {
        type: DataTypes.TEXT,
      },
      spoiler: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      film_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      like: {
        type: DataTypes.INTEGER,
      },
      dislike: {
        type: DataTypes.INTEGER,
      },
    }
  );

  review.belongsTo(user);

  return review;
}
