import { DataTypes, Model, Optional } from "sequelize";
import Config from "../DBConfig.js";
import Media from "./Project_Media.js";

interface Project_Section_attribute{
    id:number;
    project_phase_id:number;
    section_name:string;
    section_description:string;
    format:number
    deactivated_at:Date;
}

//DTOs
export interface sectionInput extends Optional<Project_Section_attribute,'id'|'deactivated_at'|'section_description'> {}//input DTO 
export interface sectionOutput extends Required<Project_Section_attribute> {}//output DTOs all fields are required

//class Project_Section_attribute
class Project_Section extends Model<Project_Section_attribute,sectionInput> implements Project_Section_attribute{
    public readonly id:number
    public project_phase_id:number
    public section_name:string
    public section_description:string
    public format:number
    public readonly deactivated_at:Date
}

Project_Section.init({
    id: {
        type:DataTypes.INTEGER.UNSIGNED,
        primaryKey:true,
        autoIncrement:true,
    },
     project_phase_id: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    section_name: {
        type:DataTypes.STRING,
        allowNull:false
    },
    section_description: {
        type:DataTypes.STRING,
        allowNull:true
    },
    format:{
        type:DataTypes.INTEGER,
        defaultValue:1
    },
     deactivated_at: {
        type:DataTypes.DATE,
        allowNull:true
    },
},{
    timestamps:true,
    sequelize:(new Config).getDatabaseConnection(),
    paranoid:true,
    createdAt:"created_at",
    updatedAt:"updated_at",
    deletedAt:"deleted_at"
})

//Contraints
Project_Section.hasMany(Media)

export default Project_Section
