import RolesRepository from "../../db/repo/Roles.js";
import { RoleInput,RoleOutput } from "../../db/models/Roles.js";
import Utility,{loggerStatements} from "../../utils/utilities.js";
import { ErrorEnum } from "../../utils/error.js";

class RolesService {
    //create instance of Roles repository
     private final:string
     private Repo 

    constructor(){
        this.Repo = new RolesRepository()
        this.final= ""
    }
    

    //properties
   

    //Create a new role
    async CreateRole(newRole:RoleInput):Promise<RoleOutput> {
        try {
            if(!newRole.role) throw new Error(ErrorEnum[403])//missing required attribute
            let role = await this.Repo.newRole(newRole)
            this.final = `${loggerStatements[1]} new role ${role.role} @ ${Utility.getDate()}`
             return role
        } catch (error) {
            this.final = `${loggerStatements[1.1]} new role ${newRole.role} @ ${Utility.getDate()}`
            throw error
        }
        finally{
            //log to file the error or success message
            await Utility.logger(this.final)
        }
    }

    //Get all roles
    async GetRoles():Promise<RoleOutput[]>{
        try {
            let roles = await this.Repo.getAllRoles()
            this.final = `${loggerStatements[4]} all roles @ ${Utility.getDate()}`
            return roles
        } catch (error) {
            this.final = `${loggerStatements[4.1]} all roles @ ${Utility.getDate()}`
            throw error
        }
        finally{
            //log to file the error success message

            await Utility.logger(this.final)
        }
    }

    //get one role
    async GetRole(roleID:number):Promise<RoleOutput>{
        try {
            if(!roleID) throw new Error(ErrorEnum[403])
            let role = await this.Repo.getRole(roleID)
            this.final = `${loggerStatements[4]} role ${role.role} @ ${Utility.getDate()}`
            return role

        } catch (error) {
            this.final = `${loggerStatements[4.1]} role with ID: ${roleID} @ ${Utility.getDate()}`
            throw error
            
        }
        finally{
            //log to file the error success message

            await Utility.logger(this.final)
        }

    }

    async UpdateRole(roleID:number,roleData:RoleInput):Promise<RoleOutput>{//update a role
        try{
            if(!roleID || !roleData.role) throw new Error(ErrorEnum[403])//if no role id

            let role = await this.Repo.updateRole(roleID,roleData)
            this.final = `${loggerStatements[2]} role ${role.role} @ ${Utility.getDate()}`
            return role
        }
        catch(error){
            this.final = `${loggerStatements[2.1]} role with ID: ${roleID} @ ${Utility.getDate()}`
            throw error
        }
        finally{
            //log to file error or success message 

            await Utility.logger(this.final)
        }
    }

    async DeleteRole(roleID:number):Promise<number>{
        try {
            if(!roleID) throw new Error(ErrorEnum[403])//if no role id

            let role = await this.Repo.deleteRole(roleID)
            this.final = `${loggerStatements[3]} role ${role.role} @ ${Utility.getDate()}`
            return role
        } catch (error) {
            this.final = `${loggerStatements[3.1]} role with ID: ${roleID} @ ${Utility.getDate()}`
            throw error
        }
        finally{
            //log to file error or success message

            await Utility.logger(this.final)
        }
    }


}

export default RolesService