import { DataTypes, Model, Optional } from "sequelize";
import Config from "../DBConfig.js";
import Project_Phase from "./Project_Phase.js";

//interface
interface Project_Version_attribute{
    id:number;
    version_uuid:string;
    project_id:number;
    version_name:string;
    version_description:string;
    version_role:number;
    version_skills:string;
    deactivated_at:Date;
    
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
    public version_role: number;
    public version_skills: string;

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
    version_role: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    version_skills: {
        type:DataTypes.STRING,
        allowNull:true
    },
    deactivated_at: {
        type: DataTypes.DATE,
        allowNull:true
    }
},{
    timestamps:true,
    sequelize:(new Config).getDatabaseConnection(),
    paranoid:true,
    createdAt:"created_at",
    updatedAt:"updated_at",
    deletedAt:"deleted_at"
})
//Contraints
Project_Version.hasMany(Project_Phase)

export default Project_Version