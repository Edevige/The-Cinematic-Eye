export default function (sequelize, DataTypes, user) {
    const poll = sequelize.define(
      "Polls",
      {
        question: {
          type: DataTypes.TEXT, // La domanda del sondaggio
          allowNull: false
        },
        options: {
          type: DataTypes.JSONB, // Le opzioni del sondaggio con i voti
          allowNull: false
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        }
      }
    );
  
    poll.belongsTo(user);
  
    return poll;
}
  