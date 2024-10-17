//URI->User Poll Interaction
//db usato per monitorare le interazioni degli utenti con i sondaggi
export default function (sequelize, DataTypes, user, poll) { 
    const upi = sequelize.define("UPIs", {
        votedOption: {
            type: DataTypes.INTEGER, // Indice dell'opzione votata
            allowNull: false
        }
    });

    upi.belongsTo(user);
    upi.belongsTo(poll);

    return upi;
}
