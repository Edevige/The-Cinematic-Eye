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
            visible: {
                type: DataTypes.BOOLEAN,
                defaultValue: false, // Default a false
            },
            follower: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            }
        }
    );

    listfilm.belongsTo(user);
  
    return listfilm;
}