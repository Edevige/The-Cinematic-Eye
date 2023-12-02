export default function(sequelize, DataTypes){
    sequelize.define('Test', {
        testField:{
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    })
}