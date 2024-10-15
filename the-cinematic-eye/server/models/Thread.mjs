export default function (sequelize, DataTypes, user) { 
    const thread = sequelize.define(
      "Thread", 
      {
        title: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        film_id: {
          type: DataTypes.INTEGER,
          allowNull: true, // Permette NULL se il thread non è legato a un film
        },
        UserId: { // Definisci esplicitamente la chiave esterna per l'utente
          type: DataTypes.INTEGER,
          allowNull: true, 
          references: {
            model: user, // riferimento alla tabella utente
            key: 'id'
          }
        }
      }
    );
  
    thread.belongsTo(user, { foreignKey: 'UserId' });
  
    return thread;
  }
  