import ProjectServices from "../services/Projects.js";
import ErrorHandler,{ErrorEnum} from "../../utils/error.js";
import { UploadRequest as UploadWithFileRequest } from "../../utils/utilities.js";
import { Request,Response } from "express";


let service = new ProjectServices();
let errorHandler = new ErrorHandler()

class ProjectController{

    async CreateProject(req:UploadWithFileRequest,res:Response){//create project controller
        try {
            if(!res.locals.user || req.files.length > 1)throw await errorHandler.CustomError(ErrorEnum[403],"You must be logged in")
            let project = await service.CreateProject(req.body,req.files.file,res.locals?.token)

            if(project.id) delete project.id;
            return res.status(201).json(project)

        } catch (error) {
            console.error(error)
            let errors:[number,string,string] = await errorHandler.HandleError(error?.errorCode,error?.message)
            return res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async GetProject(req: Request, res: Response){//get a project
        try {
            let project = await service.GetProject(req.params.id)
            if(project.id) delete project.id
            
            return res.status(200).json(project)
            
        } catch (error) {
            let errors:[number,string,string] = await errorHandler.HandleError(error?.errorCode,error?.message)
            return res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async GetAllProjects(req: Request, res: Response){//get all projects
        try{
            let project = await service.GetProjects();
            project.forEach(proj =>{ 
                if(proj.id) {
                    delete proj.id
                }
            })// remove all id values

            return res.status(200).json(project)

    } catch (error) {
        let errors:[number,string,string] = await errorHandler.HandleError(error?.errorCode,error?.message)
        return res.status(errors[0]).json({error: errors[1],message:errors[2]})
    }
    }

    async DeleteProject(req: Request, res: Response){//delete project
    try {
        if(!res.locals.user) throw await errorHandler.CustomError(ErrorEnum[403],"You must be logged in")
        let project = await service.DeleteProject(req.params.id)
        
        return res.status(200).json(project)
        
    }catch (error) {
        let errors:[number,string,string] = await errorHandler.HandleError(error?.errorCode,error?.message)
        return res.status(errors[0]).json({error: errors[1],message:errors[2]})
    }
    
    }

    async UpdateProject(req:UploadWithFileRequest, res:Response){//update project
        try {
            if(!res.locals.user )throw await errorHandler.CustomError(ErrorEnum[403],"You must be logged in")//check for user session cookie
            if(req.files){
                if(req.files.length > 1) throw new Error(ErrorEnum[403])
            }

            let project = await service.UpdateProject(req.body,req.files?.file,req.params.id)
            
            if(!project.id) delete project.id

            return res.status(200).json(project)
            
        } catch (error) {
            console.log(error)
            let errors:[number,string,string] = await errorHandler.HandleError(error?.errorCode,error?.message)
            return res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }
}


export default ProjectController