export default function (sequelize, DataTypes, user) {
    const listfilm = sequelize.define(
        "ListFilms",
        {
            title: {
                type: DataTypes.STRING,
            },
            film: {
                type: DataTypes.ARRAY(DataTypes.INTEGER),
            },
        }
    );

    listfilm.belongsTo(user);
  
    return listfilm;
}