import UserService from "../services/User.js";
import ErrorHandler from "../../utils/error.js";
import { Request,Response } from "express";

let services = new UserService();
let errorHandler = new ErrorHandler();

class UserController{
    async Signup(req: Request, res: Response){
        try {
            let user = await services.CreateUser(req.body);
            if(user) res.status(200).json({success: true, message:"User created successfully"});
            
        } catch (error) {
            let errors:[number,string,string?] = errorHandler.HandleError(error.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async SignIn(req: Request, res: Response){
        try {
            let user = await services.Login(req.body);

            res.status(200).json(user);
            
        } catch (error) {
            // console.log('error:',error)
            let errors:[number,string,string?] = errorHandler.HandleError(error.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }
}



export default UserController