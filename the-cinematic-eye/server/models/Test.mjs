export default function(sequelize, DataTypes){
    return sequelize.define('Test', {
        testField:{
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    })
}