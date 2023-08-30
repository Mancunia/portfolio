import { DataTypes, Model, Optional } from "sequelize";
import Config from "../config.js";

//interface
interface Project_Version_attribute{
    id:number;
    version_uuid:string;
    project_id:number;
    version_name:string;
    version_description:string;
    deactivated_at:Date;
    created_at?:Date;
    updated_at?:Date;
    
}

//DTOs
export interface versionInput extends Optional<Project_Version_attribute,'id'> {}
export interface versionOutput extends Required<Project_Version_attribute> {}

class Project_Version extends Model<Project_Version_attribute,versionInput> implements Project_Version_attribute{
    public id:number;
    public version_uuid: string;
    public project_id: number;
    public version_name: string;
    public version_description: string;

    public readonly deactivated_at: Date;
    
}

//initialization
Project_Version.init({
    id: {
        type:DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    version_uuid: {
        type:DataTypes.STRING,
        allowNull:false,
        unique: true
    },
    project_id: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    version_name: {
        type:DataTypes.STRING,
        allowNull:false
    },
    version_description: {
        type:DataTypes.STRING
    },
    deactivated_at: {
        type: DataTypes.DATE,
        allowNull:false
    }
},{
    timestamps:true,
    sequelize:(new Config).getDatabaseConnection(),
    paranoid:true,
    createdAt:"created_at",
    updatedAt:"updated_at",
    deletedAt:"deleted_at"
})

export default Project_Version