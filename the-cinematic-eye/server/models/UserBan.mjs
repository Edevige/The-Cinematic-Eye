export default function (sequelize, DataTypes, user) {
    const userban = sequelize.define(
      "UserBan",
      {
        ban:{
          type: DataTypes.INTEGER, // 1 se l'utente è bannato
          allowNull: false
        },
        text: {
            type: DataTypes.TEXT, //motivo del ban
            allowNull: true
        },
        admin_id: {
            type: DataTypes.INTEGER, //admin che ha bannato l'utente
            allowNull: false
        },
      }
    );
  
    userban.belongsTo(user);
  
    return userban;
  }