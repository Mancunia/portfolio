import ErrorHandler from "../../utils/error.js";
import RolesService from "../services/Roles.js";
import { Request,Response } from "express";
const services:RolesService = new RolesService();
class RolesController{
    private 

    async CreateRole(req: Request, res: Response){
        try {
            let role = await services.CreateRole(req.body) 
            res.status(200).json(role);
        } catch (error) {
            console.log(error)
            let errors:[number,string] = (new ErrorHandler).HandleError(error.message)
            res.status(errors[0]).json({error: errors[1],message:error.errors[0].message})
        }
    }
}

export default RolesController