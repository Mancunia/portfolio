import UserService from "../services/User.js";
import ErrorHandler, { ErrorEnum } from "../../utils/error.js";
import { Request,Response } from "express";
import Utility from "../../utils/utilities.js";

let services = new UserService();
let errorHandler = new ErrorHandler();

class UserController{
    async Signup(req: Request, res: Response){
        try {
            let user = await services.CreateUser(req.body);
            if(user) res.status(201).json({success: true, message:"User created successfully"});
            
        } catch (error) {
            let errors:[number,string,string?] = errorHandler.HandleError(error.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async SignIn(req: Request, res: Response){
        try {
            
            if(res.locals.user) throw new Error(ErrorEnum[403])
            

            let {userDetails,token} = await services.Login(req.body);

            res.cookie(Utility.SESSION,token,{httpOnly:true,maxAge:Utility.SessionMaxAge*1000});

            res.status(200).json({user:userDetails});
            
        } catch (error) {
            // console.log('error:',error)
            let errors:[number,string,string?] = errorHandler.HandleError(error.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async SignOut(req: Request, res: Response) {
        try{
            if(!res.locals.user) {
                console.log('From logout',res.locals.user);
                throw new Error(ErrorEnum[403])
            }

            res.cookie(Utility.SESSION,'',{maxAge:1,httpOnly:true});
            res.status(200).send("OK")

        }catch (error) {
            let errors:[number,string,string?] = errorHandler.HandleError(error.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }
}



export default UserController