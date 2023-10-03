import VersionService from "../services/Project_Versions.js";
import ErrorHandler,{ErrorEnum} from "../../utils/error.js";
import { Response,Request } from "express";

const errorHandler = new ErrorHandler()
const Service = new VersionService()

class VersionController{

    async CreateVersion(req: Request, res: Response){
        try {
            if(!res.locals.user) throw new Error(ErrorEnum[403])
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
            console.log(error)
            let errors:[number,string,string] = await errorHandler.HandleError(error.message,"Error creating new Version")
            return res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

}


export default VersionController