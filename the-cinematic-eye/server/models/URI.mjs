//URI->User Review Interaction
//db usato per monitorare le interazioni degli utenti con le recensioni
export default function (sequelize, DataTypes, user, review) {
    const uri = sequelize.define("URIs", {
        liked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false, // Default a false
        },
        disliked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false, // Default a false
        },
    });
  
    uri.belongsTo(user);
    uri.belongsTo(review);
  
    return uri;
}