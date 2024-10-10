export default function (sequelize, DataTypes, user) {
    const userrole = sequelize.define(
      "UserRole",
      {
        role:{
          type: DataTypes.INTEGER, // 1 per gli amministratori
                                   // 2 per gli utenti pro
          allowNull: false
        },
      }
    );
  
    userrole.belongsTo(user);
  
    return userrole;
  }