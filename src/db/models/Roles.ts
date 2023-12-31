import { DataTypes, Model, Optional } from "sequelize";
import Config from "../config.js";


//interface for roles
interface Role_attribute{
    id:number;
    role:string;
    role_description:string;
    deactivated_at:Date;
    created_at:Date;
    updated_at:Date;
}//roles interface


export interface RoleInput extends Optional<Role_attribute, 'id'|'role_description'> {}//role input DTO
export interface RoleOutput extends Required<Role_attribute> {}//role output DTO

//----------------------------------------------------------------Model class ----------------------------------------------------------------

class Role extends Model<Role_attribute, RoleInput> implements Role_attribute {
  
    public id!: number;
    public role!: string;
    public role_description: string;

    //timestamp
    public readonly deactivated_at: Date;
    public readonly created_at: Date;
    public readonly updated_at: Date;
    
}

Role.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role_description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    deactivated_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull:false,
        defaultValue: (new Date()).toISOString
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull:false,
        defaultValue: (new Date()).toISOString
    }
},{
    timestamps: true,
    sequelize: (new Config).getDatabaseConnection(),
    paranoid: true
})//role model properties

export default Role