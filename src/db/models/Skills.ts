import { DataTypes, Model, Optional } from "sequelize";
import Config from "../DBConfig.js";


//interface for skill
interface Skill_attribute{
    id:number;
    skill_name:string;
    skill_logo:string;
    skill_description:string;
    deactivated_at:Date;
}//skills interface

export interface SkillInput extends Optional<Skill_attribute, 'id'|'skill_description'> {}//role input DTO
export interface SkillOutput extends Required<Skill_attribute> {}//role output DTO

class Skill extends Model<Skill_attribute,SkillInput> implements Skill_attribute{
    public id: number;
    public skill_name: string;
    public skill_logo: string;
    public skill_description: string;

    public readonly deactivated_at: Date;
    
}

Skill.init({//initialization
    id:{
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    skill_name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    skill_logo: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:"https://"
    },
    skill_description:{
        type: DataTypes.STRING,
        allowNull: true,
        unique:false
    },
   
    deactivated_at:{
        type: DataTypes.DATE,
        allowNull: true,
    }
},{
    timestamps: true,
    sequelize: (new Config).getDatabaseConnection(),
    paranoid: true,
    createdAt:"created_at",
    updatedAt:"updated_at",
    deletedAt:"deleted_at"
})

export default Skill