import ProjectsRepository from "../../db/repo/Projects.js";
import { ProjectsInput,ProjectsOutput } from "../../db/models/Projects.js";
import Utility,{loggerStatements} from "../../utils/utilities.js";
import { ErrorEnum } from "../../utils/error.js";
import {v4 as uuidV4} from "uuid"
import RolesRepository from "../../db/repo/Roles.js";
import { existsSync } from "fs";

class ProjectServices{
    private readonly BASE_DIR = "./projects"
    private repo: ProjectsRepository
    private projectDir: string
    private final:string
    private readonly projectID: string

    constructor(projectID:string = null){
        this.repo = new ProjectsRepository()
        if(projectID != null){
            this.projectID = projectID
        }
        this.projectDir = this.BASE_DIR
    }


    async CreateProject(projectData:ProjectsInput,file:any):Promise<ProjectsOutput> {//TODO: create new project
        try {
            /*TODO: install uuid from https://www.npmjs.com/package/uuid 
            generate uuid for project before creating it, insert into payload @project_uuid
            */
           if(!projectData.project_name)throw new Error(ErrorEnum[403])
            projectData.project_uuid = await uuidV4();//get uuid for project
           if(!projectData.project_uuid){// if project_uuid is not provided then get from custom uuid
            projectData.project_uuid = await Utility.genRandCode()
            }

            if(projectData.project_role) projectData.project_role = (await this.CheckRole(projectData.project_role)).id
            //move image to project/project_name-files folder
            this.projectDir += "/" + projectData.project_name // attach project name to base Directory
            projectData.project_dir = this.projectDir//replace project_link with new project directory in root folder ./projects
            this.projectDir = await this.MoveFile(file)// move project logo to project folder
            projectData.project_logo = this.projectDir//replace project_logo with new project logo in root folder
            
        let project = await this.repo.newProject(projectData)
        this.final =`${loggerStatements[1]} Project with name: ${projectData.project_name} @ ${Utility.getDate()}`
            return project
        } catch (error) {
            this.final =`${loggerStatements[1.1]} new project with title: ${projectData} @ ${Utility.getDate()}`
            throw error
        }
        finally{
            await Utility.logger(this.final)
            this.projectDir = this.BASE_DIR
        }
}

async DeleteProject(project:string = this.projectID):Promise<string> {// delete project
    try {
        if(!project) throw new Error(ErrorEnum[403])
        let projectID = await this.repo.deleteProject(project)
    this.final =`${loggerStatements[3]} Project with ID: ${projectID} @ ${Utility.getDate()}`
        return projectID

    } catch (error) {
        this.final =`${loggerStatements[3.1]} Project with ID: ${project} @ ${Utility.getDate()}`
        throw error
    }
    finally{
        await Utility.logger(this.final)
    }
}

async GetProject(projectID:string = this.projectID):Promise<ProjectsOutput>{//get a project
    try {
        if(!projectID) throw new Error(ErrorEnum[403])
        let project = await this.repo.getProject(projectID)
        this.final = `${loggerStatements[4]} Project: ${project.project_name} @ ${Utility.getDate()}`
        return project
    } catch (error) {
        this.final = `${loggerStatements[4.1]} Project with ID: ${projectID} @ ${Utility.getDate()}`
        throw error
    }
    finally{
        await Utility.logger(this.final)
    }
}

async GetProjects():Promise<ProjectsOutput[]>{//get projects
    try {
        let projects = await this.repo.getProjects()
        return projects
    } catch (error) {
        this.final = `${loggerStatements[4.1]} All Project @ ${Utility.getDate()}`
        throw error
    }
    finally{
        await Utility.logger(this.final)
    }

}

async UpdateProject(projectData:ProjectsInput,file:any,projectID:string = this.projectID):Promise<ProjectsOutput>{//Update a project
    try {
        if(!projectID || !projectData.project_name) throw new Error(ErrorEnum[403])//missing project details    

        if(file){//check if file exists
        this.projectDir = (await this.repo.getProject(projectID)).project_dir//get project information

        if(!this.projectDir){//check for directory existance
            this.projectDir = `./projects/${projectData.project_name}`
        }
        projectData.project_logo = await this.MoveFile(file)
         }

        let project = await this.repo.updateProject(projectID,projectData)
        this.final = `${loggerStatements[2]} Project: ${project.project_name} @ ${Utility.getDate()}`
        return project
    } catch (error) {
        this.final = `${loggerStatements[2.1]} Project with ID: ${projectID} @ ${Utility.getDate()}`
        throw error
    }
    finally{
        await Utility.logger(this.final)
        this.projectDir = this.BASE_DIR
    }
}

private async MoveFile(file:any): Promise<string> {
    try {
        let fileLocation = await Utility.GET_DIRECTORY(file.name,this.projectDir)
            if(existsSync(fileLocation)){
                return fileLocation
            }
            file.mv(fileLocation,(err)=>{
                if(err)throw new Error(ErrorEnum[500]);
            })
            return fileLocation
        
    } catch (error) {
        throw error;
    }
}

private async CheckRole(roleID:string|number): Promise<{id:number,role:string}> {
    try {
        let role = await (new RolesRepository()).getRole(roleID)
        return {id:role.id,role:role.role}
        
    } catch (error) {
        throw error
    }
}

}

export default ProjectServices