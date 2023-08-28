import { Model } from "sequelize";
import RoleModel from "./Roles.js";

const Tables: Model[] = [ new RoleModel]

const dbInit =() => {
   Tables.forEach(table => {
    table.sequelize.sync({alter: true});}
    );
}



export default dbInit
