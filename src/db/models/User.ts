import { DataTypes, Model, Optional } from "sequelize";
import Config from "../config.js";

interface User_attribute {//user interface / protocol
    id: string;
    user_name: string;
    user_password: string;
    user_firstName: string;
    user_lastName: string;
    user_email: string;
    deactivated_at: Date;
}

export interface UserInput extends Optional<User_attribute, 'id'> {}//role input DTO
export interface UserOutput extends Required<User_attribute> {}//role output DTO

class User extends Model<User_attribute, UserInput> implements User_attribute{
    public id: string;
    public user_name: string;
    public user_password: string;
    public user_firstName: string;
    public user_lastName: string;
    public user_email: string;

    public readonly deactivated_at: Date;
    
}

User.init({ //initialization
    id:{
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement:true,
        primaryKey:true,
    },
    user_name:{
        type: DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    user_password:{
        type: DataTypes.STRING,
        allowNull:false
    },
    user_firstName:{
        type: DataTypes.STRING,
        allowNull:false
    },
    user_lastName:{
        type: DataTypes.STRING,
        allowNull:false
    },
    user_email:{
        type: DataTypes.STRING,
        allowNull:false
    },
    deactivated_at:{
        type: DataTypes.DATE,
        allowNull:true
    }
},{
    timestamps: true,
    sequelize: (new Config).getDatabaseConnection(),
    paranoid: true,
    createdAt:"created_at",
    updatedAt:"updated_at",
    deletedAt:"deleted_at"
})



export default User