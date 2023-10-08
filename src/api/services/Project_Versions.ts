import {versionInput,versionOutput} from "../../db/models/Project_Versions.js";
import ErrorHandler, { ErrorEnum } from "../../utils/error.js";
import VersionRepository from "../../db/repo/Projects_Version.js";
import Utility, { loggerStatements } from "../../utils/utilities.js";
import ProjectServices from "./Projects.js";
import RolesRepository from "../../db/repo/Roles.js";



class VersionService{
    private repo:VersionRepository;
    private final:string
    private error:ErrorHandler

    constructor(){
        this.repo = new VersionRepository();
        this.error = new ErrorHandler()
    }
     //----------------------------------------------------------------Create a new Project ----------------------------------------------------------------

     async CreateVersion(versionData:versionInput,project_id:string): Promise<versionOutput>{
        try {
            if(!project_id) throw await this.error.CustomError(ErrorEnum[403],"Invalid Project ID")
            let proj = await this.getProject(project_id)
            versionData.project_id = proj.id
            versionData.version_name = `${proj.project_name}-${versionData.version_name} `
            versionData.version_uuid = await Utility.GENERATE_UUID()//get uuid for project
            if(versionData.version_role) versionData.version_role = (await this.CheckRole(versionData.version_role)).id
            
            let version = await this.repo.createVersion(versionData)

            this.final =`${loggerStatements[1]} Version with name: ${versionData.version_name} @ ${Utility.getDate()}`
            return version
        } catch (error) {
            this.final =`${loggerStatements[1.1]} new version for project:${project_id} with title: ${versionData.version_name} @ ${Utility.getDate()}`
            throw error
        }
        finally{
            await Utility.logger(this.final)
        }
     }
     //---------------------------------------------------------------- Get One Version --------------------------------

     async GetVersion(versionID:string):Promise<versionOutput>{
        try{
            if(!versionID)throw await this.error.CustomError(ErrorEnum[403],"Invalid version ID")
            let version = await this.repo.getVersion(versionID)
            this.final =`${loggerStatements[4]} project version with ID: ${version.version_uuid} @ ${Utility.getDate()}`
            return version
        }catch (error) {
            this.final =`${loggerStatements[4.1]} new project version with ID: ${versionID} @ ${Utility.getDate()}`
            throw error
        }
        finally{
            await Utility.logger(this.final)
        }
     }

     //-------------------------------------------------------------- Get All Versions ---------------------------------------

     async GetAllVersion(projectID:string):Promise<versionOutput[]>{
        try{
            if(!projectID)throw await this.error.CustomError(ErrorEnum[403],"Invalid Project ID")
            let version = await this.repo.getAllVersions((await this.getProject(projectID)).id)
            this.final =`${loggerStatements[4]} versions for project with ID: ${projectID} @ ${Utility.getDate()}`
            return version
        }catch (error) {
            this.final =`${loggerStatements[4.1]} versions for project with ID: ${projectID} @ ${Utility.getDate()}`
            throw error
        }
        finally{
            await Utility.logger(this.final)
        }
     }

     //-------------------------------------------------------------- Update a Version --------------------------------
     async UpdateVersion(versionID:string, versionData:versionInput):Promise<versionOutput>{
        try {
            if(!versionID || !versionData.version_name || versionData?.project_id) throw await this.error.CustomError(ErrorEnum[403],"Invalid Version Data")
            let version = await this.repo.updateVersion(versionID, versionData)
            this.final =`${loggerStatements[2]} version with ID: ${version.version_uuid} @ ${Utility.getDate()}`
            return version
        }catch (error) {
            this.final =`${loggerStatements[2.1]} version with ID: ${versionID} @ ${Utility.getDate()}`
            throw error
        }
        finally{
            await Utility.logger(this.final)
        }
     }


     async DeleteVersion(versionID:string):Promise<number>{
        try {
            if(!versionID)throw await this.error.CustomError(ErrorEnum[403],"Invalid Version ID")
            let version = await this.repo.deleteVersion(versionID)
            this.final =`${loggerStatements[3]} version with ID: ${versionID} @ ${Utility.getDate()}`
            return version
            
        }catch (error) {
            this.final =`${loggerStatements[3.1]} version with ID: ${versionID} @ ${Utility.getDate()}`
            throw error
        }
        finally{
            await Utility.logger(this.final)
        }
     }

     private async getProject(projectID:string):Promise<any> {
        try {
            let project = await (new ProjectServices).GetProject(projectID)
            return project
        } catch (error) {
            throw error
        }
     }

     private async CheckRole(roleID:string|number): Promise<{id:number,role:string}> {
        try {
            let role = await (new RolesRepository()).getRole(roleID)
            return role
            
        } catch (error) {
            throw error
        }
    }

}


export default VersionService
