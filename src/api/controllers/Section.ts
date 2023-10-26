import SectionService from "../services/Section.js";
import ErrorHandler,{ErrorEnum} from "../../utils/error.js";
import { UploadRequest } from "../../utils/utilities.js";
import { Request,Response } from "express";

const service = new SectionService()
const errorHandler = new ErrorHandler()

class SectionController{

    async CreateSection(req: UploadRequest, res: Response){
        try {
            if(!res.locals.user)throw await errorHandler.CustomError(ErrorEnum[403],"Invalid User")
            let phaseID = Number(req.params.phase)
            let sectionData = req.body
            let files = req.files.file
            
            let section = await service.CreateSection(phaseID,sectionData,files)

            return res.status(200).json(section)
        } catch (error) {
            console.log(error)
            let errors:[number,string,string] = await errorHandler.HandleError(error?.errorCode,error?.message)
            return res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async GetSections(req: Request, res: Response){
        try {
            let phaseID = Number(req.params.phase)
            let sections = await service.GetSection(phaseID)

            return res.status(200).json(sections)
            
        } catch (error) {
            console.log(error)
            let errors:[number,string,string] = await errorHandler.HandleError(error?.errorCode,error?.message)
            return res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }
}

export default SectionController