import { Request,Response,NextFunction } from "express";
import Utility from "../../utils/utilities.js";


class UserMiddlware{

    static async CHECK_USER_LOGIN(req:Request, res:Response, next:NextFunction){
        try {
            //check if user is already logged in
            let user = req.cookies.session
            if(user){
                let token = await Utility.DECODE_TOKEN(user)
                res.locals.user = true
                res.locals.token = token
            }else{ 
                res.locals.user = false
            }

            next()
        } catch (error) {
            Utility.logger("#Error in UserMiddlware.CHECK_USER_LOGIN")
            throw error
        }
    }

}

export default UserMiddlware