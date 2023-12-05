import argon2id from "argon2";

async function hashPass(user){
    if(!user.changed('password')){
        return
    }
    try {
        return await argon2id.hash(user.password).then(hash => {user.setDataValue('password',hash)})
    } catch (error) {
        console.log(error);
    }
    
}

export default function(sequelize, DataTypes){
    const user = sequelize.define('Users', {
        email:{
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false 
        }
    },{hooks: {
        beforeCreate: hashPass,
        beforeUpdate: hashPass,
        beforeSave: hashPass
    }})


    user.prototype.comparePass = async function (password){
        try {
            console.log(this.password, password);
            return await argon2id.verify(this.password, password);
        } catch (error) {
            console.log(error);
        }
        
    }

    return user;

}