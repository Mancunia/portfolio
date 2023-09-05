import RolesModel,{RoleInput,RoleOutput} from "../models/Roles.js";
import { ErrorEnum } from "../../utils/error.js";

interface RolesRepo_attributes{
    newRole:(roleInput:RoleInput)=>Promise<RoleOutput>;
    updateRole:(roleID:number,roleInput:RoleInput)=>Promise<RoleOutput>;
    deleteRole:(roleID:number)=>Promise<number>;
    getRole:(roleID:number)=>Promise<RoleOutput>;
    getAllRoles:()=>Promise<RoleOutput[]>;
}

class RolesRepository implements RolesRepo_attributes{

    //----------------------------------------------------------------Create a new role ----------------------------------------------------
    async newRole(roleInput:RoleInput):Promise<RoleOutput>{
        try {
            let role:RoleOutput = await RolesModel.create(roleInput);
            if(!role) throw new Error(ErrorEnum[403])
            return role

        } catch (error) {
            throw error;
        }
        
    }

    //----------------------------------------------------------------update ----------------------------------------------------------------
    async updateRole(roleID:number, roleInput:RoleInput): Promise<RoleOutput>{
        try {
            let role = await this.getRole(roleID);
            
            if(!role)throw new Error(ErrorEnum[404])
            
            await (role as RolesModel).update(roleInput)

            return role

        } catch (error) {
            throw error;
        }
    }

    //----------------------------------------------------------------delete ----------------------------------------------------------------
    async deleteRole(roleID:number): Promise<number>{
        try{
            let role:number = await RolesModel.destroy({where: {id: roleID}})
            if(!role) throw new Error(ErrorEnum[403])
            return role
    }
    catch(error){
        throw error;
    }
    }

    //----------------------------------------------------------------get one role ----------------------------------------------------------------
    async getRole(roleID:number): Promise<RoleOutput>{
        try {
            let role:RoleOutput = await RolesModel.findOne({where:{id:roleID}});
            if(!role)throw new Error(ErrorEnum[404])
            return role;
        } catch (error) {
            throw error;
        }
    }

    //---------------------------------------------------------------- get all roles ----------------------------------------------------------------
    async getAllRoles(): Promise<RoleOutput[]>{
        try {
            let roles:RoleOutput[] = await RolesModel.findAll()
            if(!roles)throw new Error(ErrorEnum[404])
            return roles;
        } catch (error) {
            throw error;
        }
        
        
    }




}

export default RolesRepository