import RoleModel from "./models/Roles.js";


//Check environment
const isDev = process.env.NODE_ENV === 'development';

const dbInit = ()=> {
    //TODO:Initialize models here 
    RoleModel.sync({alter: isDev});
}

export default dbInit; 