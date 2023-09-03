import RolesRepository from "../../db/repo/Roles.js";
import { RoleInput,RoleOutput } from "../../db/models/Roles.js";
import Utility,{loggerStatements} from "../../utils/utilities.js";
import { ErrorEnum } from "../../utils/error.js";

class RolesService {
    //create instance of Roles repository
    private Repo = new RolesRepository();

    //properties
    private final:string

    async CreateRole(newRole:RoleInput):Promise<RoleOutput> {
        try {
            if(!newRole.role) throw new Error(ErrorEnum[403])
            let role = await this.Repo.newRole(newRole)
            this.final = `${loggerStatements[1]} new role ${role.role} @ ${Utility.getDate}`
             return role
        } catch (error) {
            this.final = `${loggerStatements[1.1]} new role ${newRole.role} @ ${Utility.getDate}`
            throw error
        }
        finally{
            //log to file the error or success message
        }
    }

}

export default RolesService