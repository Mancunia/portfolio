import ErrorHandler, { ErrorEnum } from "../../utils/error.js";
import RolesService from "../services/Roles.js";
import { Request,Response } from "express";
const services = new RolesService();
const errorHandler = new ErrorHandler();
class RolesController{
    async CreateRole(req: Request, res: Response){//create new role
        try {
            if(!res.locals.user) throw new Error(ErrorEnum[403])
            let role = await services.CreateRole(req.body) 
            res.status(201).json(role);
        } catch (error) {
            let errors:[number,string,string] = errorHandler.HandleError(error.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async GetRoles(req: Request, res: Response){//get roles
        try {
            let roles = await services.GetRoles();
            res.status(200).json(roles)            
        } catch (error) {
            // console.log(error)
            let errors:[number,string,string] = errorHandler.HandleError(error.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async GetRole(req:Request,res:Response){//get a role
        try {
            let role = await services.GetRole(Number(req.params.id))
            res.status(200).json(role)//respond
            res.end()
        } catch (error) {
            console.log(error)
            let errors:[number,string,string] = errorHandler.HandleError(error.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async UpdateRole(req:Request,res:Response){//update a role
        try {
            if(!res.locals.user) throw new Error(ErrorEnum[403])
            let role = await services.UpdateRole(Number(req.params.id),req.body)
            res.status(200).json(role)
        } catch (error) {
            let errors:[number,string,string] = errorHandler.HandleError(error.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async DeleteRole(req:Request,res:Response){
        try {
            if(!res.locals.user) throw new Error(ErrorEnum[403])
            let role = await services.DeleteRole( Number(req.params.id))
            res.status(200).json({role:role})
            
        } catch (error) {
            console.log(error)
            let errors:[number,string,string] = errorHandler.HandleError(error.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }
}

export default RolesController