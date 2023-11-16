import Projects,{ProjectsInput,ProjectsOutput} from "../models/Projects.js";
import ErrorHandler, { ErrorEnum } from "../../utils/error.js";

interface Project_attributes {
    newProject:(projectData:ProjectsInput)=>Promise<ProjectsOutput>;
    getProject:(projectID:string)=>Promise<ProjectsOutput>
    getProjects:()=>Promise<ProjectsOutput[]>;
    updateProject:(projectID:string,project:ProjectsInput)=>Promise<ProjectsOutput>
    deleteProject:(projectID:string)=>Promise<string>;
}

class ProjectsRepository implements Project_attributes {
    private error: ErrorHandler
    constructor(){
        this.error = new ErrorHandler()
    }

    //------------------------------------New Project ----------------------------------------------------------------
    async newProject(projectData: ProjectsInput) : Promise<ProjectsOutput>{
        try {
            let project = await Projects.create(projectData);
            return project
            
        } catch (error) {
            console.log("in project repos",error)
            if(error.name === "SequelizeUniqueConstraintError") {
                throw await this.error.CustomError(ErrorEnum[401],`Project with name ${projectData.project_name} exists already`)
                }
                throw await this.error.CustomError(ErrorEnum[400],`Error creating project`)
        }
    }

    //----------------------------------------------------------------get project --------------------------------
    async getProject(projectID: string): Promise<ProjectsOutput>{
        try {
            let project = await Projects.findOne({where:{project_uuid: projectID}})
            if (!project) throw await this.error.CustomError(ErrorEnum[404],`Project Not Found`)
            return project
        } catch (error) {
            throw error
        }
    }
    //---------------------------------------------------------------- get All Projects ----------------------------------------------------------------

    async getProjects(): Promise<ProjectsOutput[]>{
        try {
            let project = await Projects.findAll()
            if (!project)  throw await this.error.CustomError(ErrorEnum[404],`Projects Not Found`)
            return project
        } catch (error) {
            throw error
        }

    }

    async updateProject(projectID: string, projectData: ProjectsInput): Promise<ProjectsOutput>{
        try {
            let project = await this.getProject(projectID);

            await (project as Projects).update(projectData)

            return project;

        } catch (error) {
            if(error.name === "SequelizeUniqueConstraintError") {
                throw await this.error.CustomError(ErrorEnum[401],`Project name has to be unique`)
                }
                throw error;
        }
    }

    async deleteProject(projectID: string):Promise<string>{
        try {
            let project = await this.getProject(projectID)
            await Projects.destroy({where:{project_uuid: projectID}})

            return project.project_name
            
        } catch (error) {
            throw await this.error.CustomError(ErrorEnum[401],`Project could not be deleted`)
        }
    }
}

export default ProjectsRepository