import VersionService from "../services/Project_Versions.js";
import ErrorHandler,{ErrorEnum} from "../../utils/error.js";
import { Response,Request } from "express";

const errorHandler = new ErrorHandler()
const Service = new VersionService()

class VersionController{

    async CreateVersion(req: Request, res: Response){//create version
        try {
            if(!res.locals.user) throw await errorHandler.CustomError(ErrorEnum[403],"You must be logged in")
            let project = req.params.project//cast to number
            let versionData = req.body
            let version = await Service.CreateVersion(versionData, project)

            if(version.id) delete version.id
            if(version.project_id) delete version.project_id

            return res.status(201).json({version,actions:{
                "getSections":`/projects/versions/sections/${version.version_uuid}`,
                "Update":{"URL":`/projects/versions/${version.version_uuid}`,"body":"VersionDTO"},
                "Delete":{"URL":`/projects/versions/${version.version_uuid}`},
            }})
            
        } catch (error) {
            let errors:[number,string,string] = await errorHandler.HandleError(error?.errorCode,error?.message)
            return res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async GetVersions(req: Request, res: Response){//get all versions
        try {
            if(!res.locals.user) throw await errorHandler.CustomError(ErrorEnum[403],"You must be logged in")
            let project = req.params.project

            let versions = await Service.GetAllVersion(project)

            return res.status(200).json(versions)
            
        } catch (error) {
            console.log(error)
            let errors:[number,string,string] = await errorHandler.HandleError(error?.errorCode,error?.message)
            return res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async GetAVersion(req: Request, res: Response){//get a single version
        try {
            if(!res.locals.user) throw await errorHandler.CustomError(ErrorEnum[403],"You must be logged in")
            let id = req.params.id

            let versions = await Service.GetVersion(id)

            return res.status(200).json(versions)
            
        } catch (error) {
            console.log(error)
            let errors:[number,string,string] = await errorHandler.HandleError(error?.errorCode,error?.message)
            return res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async UpdateAVersion(req: Request, res: Response){//update a single
    try {
        if(!res.locals.user) throw await errorHandler.CustomError(ErrorEnum[403],"You must be logged in")
        let id = req.params.id
        let versionData = req.body

        let versions = await Service.UpdateVersion(id, versionData)

        return res.status(200).json(versions)
        
    } catch (error) {
        console.log(error)
        let errors:[number,string,string] = await errorHandler.HandleError(error?.errorCode,error?.message)
        return res.status(errors[0]).json({error: errors[1],message:errors[2]})
    }
    }

    async DeleteAVersion(req: Request, res: Response){//delete a single
    try {
        if(!res.locals.user) throw await errorHandler.CustomError(ErrorEnum[403],"You must be logged in")
        let id = req.params.id
        await Service.DeleteVersion(id);
        res.status(200).send("ok")
        
    } catch (error) {
        console.log(error)
        let errors:[number,string,string] = await errorHandler.HandleError(error?.errorCode,error?.message)
        return res.status(errors[0]).json({error: errors[1],message:errors[2]})
    }
    }

}


export default VersionController