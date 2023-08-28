import RoleModel from "./models/Roles.js";
import SkillModel from "./models/Skills.js";
import UserModel from "./models/User.js";


//Check environment
const isDev = process.env.NODE_ENV === 'development';

const dbInit = ()=> {
    //TODO:Initialize models here 
    try {
         RoleModel.sync({alter: isDev});
         SkillModel.sync({alter: isDev});
         UserModel.sync({alter: isDev});

    } catch (error) {
        console.log("Error:",error);
    }
   
}

export default dbInit; 