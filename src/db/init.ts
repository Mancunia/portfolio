import RoleModel from "./models/Roles.js";
import SkillModel from "./models/Skills.js";
import UserModel from "./models/User.js";
import ProjectsModel from "./models/Projects.js";
import Project_VersionModel from "./models/Project_Versions.js";
import Project_PhaseModel from "./models/Project_Phase.js";
import Project_SectionModel from "./models/Project_Section.js";
import MediaModel from "./models/Project_Media.js";
import FormatModel from "./models/Format.js";


//Check environment
const isDev = process.env.NODE_ENV === 'development';

const dbInit = ()=> {
    //TODO:Initialize models here 
    try {
         RoleModel.sync({alter: isDev});
         SkillModel.sync({alter: isDev});
         UserModel.sync({alter: isDev});
         ProjectsModel.sync({alter: isDev});
         Project_VersionModel.sync({alter: isDev});
         Project_PhaseModel.sync({alter: isDev});
         Project_SectionModel.sync({alter: isDev});
         MediaModel.sync({alter: isDev});
         FormatModel.sync({alter: isDev});


    } catch (error) {
        console.log("Error:",error);
    }
   
}

export default dbInit; 