import FormatService from "../services/Format.js";
import ErrorHandler, { ErrorEnum } from "../../utils/error.js";
import { Request,Response } from "express";
import { UploadRequest as UploadWithFileRequest } from "../../utils/utilities.js";


const errorHandler = new ErrorHandler()
const services = new FormatService()

class FormatController{

    async CreateFormat (req: UploadWithFileRequest, res: Response){//create controller
        try {
            if(!res.locals.user || req.files.length > 1) throw new Error(ErrorEnum[403]);
            let format = await services.CreateFormat(req.body,req.files.file);
            return res.status(201).json(format);
        } catch (error) {
            console.log('error:',error);
            let errors:[number,string,string] = await errorHandler.HandleError(error.message)
            return res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async GetFormat (req: Request, res: Response){//get controller
    try {
        let format = await services.GetFormat(Number(req.params.id));
        return res.status(200).json(format);
        
    } catch (error) {
        let errors:[number,string,string] = await errorHandler.HandleError(error.message)
        return res.status(errors[0]).json({error: errors[1],message:errors[2]})
    }
    }

    async GetFormats(req:Request,res:Response){ // get all formats
        try {
            let formats = await services.GetFormats()
            return res.status(200).json(formats)
            
        } catch (error) {
            let errors:[number,string,string] = await errorHandler.HandleError(error.message)
        return res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async UpdateFormat(req:UploadWithFileRequest,res:Response){// update all formats
        try {
            if(!res.locals.user|| req.files.length>1) throw new Error(ErrorEnum[403])
            let format = await services.UpdateFormat(Number(req.params.id),req.body,req.files.file)
            return res.status(200).json(format)
        } catch (error) {
            let errors:[number,string,string] = await errorHandler.HandleError(error.message)
        return res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async DeleteFormat(req:Request,res:Response){ //Delete format
        try {
            if(!res.locals.user) throw new Error(ErrorEnum[403])
            let format = await services.DeleteFormat(Number(req.params.id))
            return res.status(200).json(format)
        } catch (error) {
            let errors:[number,string,string] = await errorHandler.HandleError(error.message)
        return res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }
}

export default FormatController