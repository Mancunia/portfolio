import { Request,Response } from "express";
import PhaseService from "../services/Project_Phase.js";
import ErrorHandler,{ErrorEnum} from "../../utils/error.js";

const services = new PhaseService();
const errorHandler = new ErrorHandler();

class PhaseController{

    async CreatePhase(req: Request, res: Response){
        try {
            if(!res.locals.user) throw await errorHandler.CustomError(ErrorEnum[403],"You must be logged in")
            let version = req.params.version
            let phaseData = req.body

            let phase = await services.CreatePhase(version,phaseData)

            return res.status(200).json(phase)
            
        } catch (error) {
            console.log("Error",error)
            let errors:[number,string,string] = await errorHandler.HandleError(error?.errorCode,error?.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }
}

export default PhaseController