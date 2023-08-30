import { DataTypes, Model, Optional} from "sequelize";
import Config from "../config.js";
import User from "./User.js";

interface Projects_attributes{
    id: number;
    project_uuid: string;
    project_name: string;
    project_description: string;
    project_link: string;
    project_logo: string;
    project_role: number[];
    project_skills: number[];
    project_users: any;
    deactivated_at: Date;
}

//DTO
export interface ProjectsInput extends Optional<Projects_attributes, 'id'|'project_description'|'project_link'|'project_logo'>{}//input DTO
export interface ProjectsOutput extends Required<Projects_attributes>{}//output DTO

class Projects extends Model<Projects_attributes, ProjectsInput> implements Projects_attributes{
    public id: number;

    public project_name: string;
    public project_description: string;
    public project_link: string;
    public project_logo: string;
    public project_role: number[];
    public project_skills: number[];
    public project_users: number;//foreign key

    public readonly project_uuid: string;
    public readonly deactivated_at: Date;
}

Projects.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    project_uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    project_description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    project_link: {
        type:DataTypes.STRING,
        allowNull:true
    },
    project_name: {
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    project_logo: {
        type:DataTypes.STRING
    },
    project_role: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    project_skills: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    project_users: {
        type:DataTypes.INTEGER
    },
    deactivated_at:{
        type:DataTypes.DATE
    }
},{
    timestamps:true,
    sequelize:(new Config).getDatabaseConnection(),
    paranoid:true,
    createdAt:"created_at",
    updatedAt:"updated_at",
    deletedAt:"deleted_at"
})

Projects.hasOne(User)

export default Projects