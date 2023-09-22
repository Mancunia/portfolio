import RolesModel,{RoleInput,RoleOutput} from "../models/Roles.js";
import { ErrorEnum } from "../../utils/error.js";
import { Op } from "sequelize";

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
            return role

        } catch (error) {
           if(error.name === "SequelizeUniqueConstraintError") {
            throw Error(ErrorEnum[401])
            }
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
            if(error.name === "SequelizeUniqueConstraintError") {
                throw Error(ErrorEnum[401])
                }
            throw error;
        }
    }

    //----------------------------------------------------------------delete ----------------------------------------------------------------
    async deleteRole(roleID:number): Promise<number>{
        try{
            let role:number = await RolesModel.destroy({where: {id: roleID}})
            if(!role) throw new Error(ErrorEnum[404])
            return role
    }
    catch(error){
        throw error;
    }
    }

    //----------------------------------------------------------------get one role ----------------------------------------------------------------
    async getRole(roleID:number|string): Promise<RoleOutput>{
        try {
            let role:RoleOutput = await RolesModel.findOne({ where: {
                [Op.or]: [
                  { id: roleID },
                  { role: roleID },
                ],
              },});
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