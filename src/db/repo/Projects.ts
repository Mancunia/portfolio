import Projects,{ProjectsInput,ProjectsOutput} from "../models/Projects.js";
import { ErrorEnum } from "../../utils/error.js";

interface Project_attributes {
    newProject:(projectData:ProjectsInput)=>Promise<ProjectsOutput>;
    getProject:(projectID:string)=>Promise<ProjectsOutput>
    getProjects:()=>Promise<ProjectsOutput[]>;
    updateProject:(projectID:string,project:ProjectsInput)=>Promise<ProjectsOutput>
    deleteProject:(projectID:string)=>Promise<string>;
}

class ProjectsRepository implements Project_attributes {

    //------------------------------------New Project ----------------------------------------------------------------
    async newProject(projectData: ProjectsInput) : Promise<ProjectsOutput>{
        try {
            let project = await Projects.create(projectData);
            return project
            
        } catch (error) {
            if(error.name === "SequelizeUniqueConstraintError") {
                throw Error(ErrorEnum[401])
                }
                throw error;
        }
    }

    //----------------------------------------------------------------get project --------------------------------
    async getProject(projectID: string): Promise<ProjectsOutput>{
        try {
            let project = await Projects.findOne({where:{project_uuid: projectID}})
            if (!project) throw Error(ErrorEnum[404])
            return project
        } catch (error) {
            throw error
        }
    }
    //---------------------------------------------------------------- get All Projects ----------------------------------------------------------------

    async getProjects(): Promise<ProjectsOutput[]>{
        try {
            let project = await Projects.findAll()
            if (!project) throw Error(ErrorEnum[404])
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
                throw Error(ErrorEnum[401])
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
            throw error
        }
    }
}

export default ProjectsRepository