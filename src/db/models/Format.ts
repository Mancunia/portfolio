import { DataTypes, Model, Optional } from "sequelize";
import Config from "../config.js";
import Project_Section from "./Project_Section.js";

interface Format_attributes{
    id:number;
    format_name:string;
    format_icon:string;
    deactivated_at:Date;
}

export interface FormatInput extends Optional<Format_attributes,'id'> {}
export interface FormatOutput extends Required<Format_attributes>{}

class Format extends Model<Format_attributes,FormatInput> implements Format_attributes{
    public id: number;
    public format_name: string;
    public format_icon: string;
    public readonly deactivated_at: Date;
}

Format.init({
    id: {
        type:DataTypes.INTEGER.UNSIGNED,
        primaryKey:true,
        autoIncrement:true
    },
    format_name: {
        type:DataTypes.STRING,
        allowNull:false,
    },
    format_icon: {
        type:DataTypes.STRING,
        allowNull:true
    },
    deactivated_at: {
        type:DataTypes.DATE,
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
Format.hasMany(Project_Section)

export default Format