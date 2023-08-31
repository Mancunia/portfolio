import { DataTypes, Model, Optional } from "sequelize";
import Config from "../config.js";
import Project_Section from "./Project_Section.js";

interface Media_attributes {
    id:number;
    project_section_id:number;
    media_type:string;
    media_location:string;
    media_preferred_width:number;
    media_preferred_height:number;
    deactivated_at:Date
}

//DTO
export interface MediaInput extends Optional<Media_attributes,'id'|'media_type'>{}//input DTO
export interface MediaOutput extends Required<Media_attributes>{}//output DTO


class Media extends Model<Media_attributes,MediaInput> implements Media_attributes{
    public id: number;
    public project_section_id: number;
    public media_type: string;
    public media_location: string;
    public media_preferred_width: number;
    public media_preferred_height: number;
    public readonly deactivated_at: Date;

}

Media.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    media_type:{
        type:DataTypes.STRING,
        allowNull:false
    },
    project_section_id: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    media_location: {
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    media_preferred_width: {
        type:DataTypes.INTEGER
    },
    media_preferred_height: {
        type:DataTypes.INTEGER
    },
    deactivated_at: {
        type:DataTypes.DATE
    }
},{
    timestamps:true,
    sequelize:(new Config).getDatabaseConnection(),
    paranoid:false,
    createdAt:"created_at",
    updatedAt:"updated_at"
})

export default Media