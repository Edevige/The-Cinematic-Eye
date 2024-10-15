export default function (sequelize, DataTypes, user) {
    const report = sequelize.define(
      "Reports",
      {
        mreason:{
          type: DataTypes.TEXT,
          allowNull: false
        },
        text: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        
      }
    );
  
    report.belongsTo(user);
  
    return report;
  }