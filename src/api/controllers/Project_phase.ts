import { Request,Response } from "express";
import PhaseService from "../services/Project_Phase.js";
import ErrorHandler,{ErrorEnum} from "../../utils/error.js";

const services = new PhaseService();
const errorHandler = new ErrorHandler();

class PhaseController{

    async CreatePhase(req: Request, res: Response){// Create a new phase
        try {
            if(!res.locals.user) throw await errorHandler.CustomError(ErrorEnum[403],"You must be logged in")
            let version = req.params.version
            let phaseData = req.body

            let phase = await services.CreatePhase(version,phaseData)

            return res.status(200).json(phase)
            
        } catch (error) {
            let errors:[number,string,string] = await errorHandler.HandleError(error?.errorCode,error?.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }
    async GetPhase(req: Request, res: Response){// Get a phase
        try {
            let versions = await services.GetPhase(Number(req.params.version))
            
            return res.status(200).json(versions)
        } catch (error) {
            let errors:[number,string,string] = await errorHandler.HandleError(error?.errorCode,error?.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async GetAllPhases(req: Request, res: Response){// Get all phases
        try {
            let versions = await services.GetAllPhase(req.params.version)
            
            return res.status(200).json(versions)
        } catch (error) {
            let errors:[number,string,string] = await errorHandler.HandleError(error?.errorCode,error?.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async UpdatePhase(req:Request,res:Response){//Update a phase
        try {
            if(!res.locals.user)throw errorHandler.CustomError(ErrorEnum[403],"Invalid User")
            let phase = await services.UpdatePhase(Number(req.params.phase),req.body)
            return res.status(200).json(phase)
        } catch (error) {
            let errors:[number,string,string] = await errorHandler.HandleError(error?.errorCode,error?.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async DeletePhase(req:Request,res:Response){// Delete phase
        try {
            if(!res.locals.user)throw errorHandler.CustomError(ErrorEnum[403],"Invalid User")
            let phase = await services.DeletePhase(Number(req.params.phase))
            return res.status(200).send("okay")
        } catch (error) {
            let errors:[number,string,string] = await errorHandler.HandleError(error?.errorCode,error?.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }
}

export default PhaseController