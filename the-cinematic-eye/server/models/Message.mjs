export default function (sequelize, DataTypes, user, thread) {
    const message = sequelize.define("Message", {
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      
    });
  
    message.belongsTo(user);
    message.belongsTo(thread);
  
    return message;
  }
  