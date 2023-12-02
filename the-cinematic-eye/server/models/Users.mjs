export default function(sequelize, DataTypes){
    return sequelize.define('Users', {
        email:{
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false 
        }
    })
}