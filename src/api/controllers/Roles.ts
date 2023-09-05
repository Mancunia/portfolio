import ErrorHandler from "../../utils/error.js";
import RolesService from "../services/Roles.js";
import { Request,Response } from "express";
const services = new RolesService();
const errorHandler = new ErrorHandler();
class RolesController{
    async CreateRole(req: Request, res: Response){//create new role
        try {
            let role = await services.CreateRole(req.body) 
            res.status(200).json(role);
        } catch (error) {
            let errors:[number,string] = errorHandler.HandleError(error.message)
            res.status(errors[0]).json({error: errors[1]})
        }
    }

    async GetRoles(req: Request, res: Response){//get roles
        try {
            let roles = await services.GetRoles();
            res.status(200).json(roles)            
        } catch (error) {
            console.log(error)
            let errors:[number,string] = errorHandler.HandleError(error.message)
            res.status(errors[0]).json({error: errors[1]})
        }
    }

    async GetRole(req:Request,res:Response){//get a role
        try {
            let roleID:number = Number(req.params.id)
            let role = await services.GetRole(roleID)
            res.status(200).json(role)//respond
            res.end()
        } catch (error) {
            console.log(error)
            let errors:[number,string] = errorHandler.HandleError(error.message)
            res.status(errors[0]).json({error: errors[1]})
        }
    }

    async UpdateRole(req:Request,res:Response){//update a role
        try {
            let roleID:number = Number(req.params.id)
            let roleData = req.body
            let role = await services.UpdateRole(roleID,roleData)
            res.status(200).json(role)
        } catch (error) {
            // console.log(error)
            let errors:[number,string] = errorHandler.HandleError(error.message)
            res.status(errors[0]).json({error: errors[1]})
        }
    }

    async DeleteRole(req:Request,res:Response){
        try {
            let roleID:number = Number(req.params.id)
            let role = await services.DeleteRole(roleID)
            res.status(200).json({role:role})
            
        } catch (error) {
            console.log(error)
            let errors:[number,string] = errorHandler.HandleError(error.message)
            res.status(errors[0]).json({error: errors[1]})
        }
    }
}

export default RolesController