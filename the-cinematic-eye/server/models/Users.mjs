import argon2id from "argon2";

async function hashPass(user){
    if(!user.changed('password')){
        return
    }
    try {
         const passHash = await argon2id.hash(user.password);
         user.setDataValue('password',passHash);
         return passHash
    } catch (error) {
        console.log('error',error);
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
        beforeUpdate: hashPass,
        beforeSave: hashPass
    }})


    user.prototype.comparePass = async function (password){
        try {
             const isEqual = await argon2id.verify(this.password, password);
             return isEqual;
        } catch (error) {
            console.log(error);
        }
        
    }

    return user;

}