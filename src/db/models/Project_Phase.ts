import { DataTypes, Model, Optional } from "sequelize";
import Config from "../config.js";
import Project_Section from "./Project_Section.js";

//interface
interface Project_Phase_attributes{
    id:number;
    project_version_id:number;
    phase_name:string;
    phase_description:string;
    deactivated_at:Date;
    created_at?:Date;
    updated_at?:Date;
}
//DTOs
export interface PhaseInput extends Optional<Project_Phase_attributes,'id'|'deactivated_at'|'phase_description'> {}
export interface PhaseOutput extends Required<Project_Phase_attributes> {}

class Project_Phase extends Model<Project_Phase_attributes, PhaseInput> implements Project_Phase_attributes{
    public id: number;
    public project_version_id: number;
    public phase_name: string;
    public phase_description: string;

    public readonly deactivated_at: Date;
    public readonly created_at?: Date;
    public readonly updated_at?: Date;
    
}

Project_Phase.init({
    id: {
        type:DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    project_version_id: {
        type:DataTypes.INTEGER,
        allowNull: false
    },
    phase_name: {
        type:DataTypes.STRING,
        allowNull: false
    },
    phase_description: {
        type:DataTypes.STRING,
        allowNull: true
    },
    deactivated_at: {
        type:DataTypes.DATE
    }
},{
    timestamps:true,
    sequelize:(new Config).getDatabaseConnection(),
    paranoid:true,
    createdAt:"created_at",
    updatedAt:'updated_at',
    deletedAt:"deleted_at"
})
//Contraints
Project_Phase.hasMany(Project_Section)

export default Project_Phase