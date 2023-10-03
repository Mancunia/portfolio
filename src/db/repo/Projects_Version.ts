import Project_Version,{versionInput,versionOutput} from "../../db/models/Project_Versions.js";
import { ErrorEnum } from "../../utils/error.js";

interface version_description {
    createVersion:(versioinData:versionInput)=>Promise<versionOutput>;
    getVersion:(versioinID:string)=>Promise<versionOutput>
    getAllVersions:(versioinID:number)=>Promise<versionOutput[]>;
    updateVersion:(versionID:string,versioinData:versionInput)=>Promise<versionOutput>
    deleteVersion:(versioinID:string)=>Promise<number>;
}

class VersionRepository implements version_description{

    //---------------------------------------------------------------- Create Version ------------------------------
    async createVersion(versioinData:versionInput): Promise<versionOutput>{
        try {
            let version = await Project_Version.create(versioinData);
           
            return version
        } catch (error) {
            if(error.name === "SequelizeUniqueConstraintError") {
                throw Error(ErrorEnum[401])
                }
                throw error;
        }
    }

    //---------------------------------------------------------------- Get Version ------------------------------
    async getVersion(versioinID:string): Promise<versionOutput>{
        try {
            let version = await Project_Version.findOne({where:{version_uuid:versioinID}});
            if(!version)throw new Error(ErrorEnum[404])
            return version
            
        } catch (error) {
            throw error
        }
    }

    //---------------------------------------------------------------- Get all versions ------------------------------------------------
    async getAllVersions(projectID:number): Promise<versionOutput[]>{
        try {
            let versions = await Project_Version.findAll({where:{project_id:projectID}});
            if(!versions)throw new Error(ErrorEnum[404])
            return versions
            
        } catch (error) {
            throw error
        }
    }

    //---------------------------------------------------------------- Update version ------------------------------------------------
    async updateVersion(versionID:string,versionData:versionInput): Promise<versionOutput>{
        try {
            let version = await this.getVersion(versionID);
            await (version as Project_Version).update(versionData)
            return version
            
        } catch (error) {
            throw error
        }
    }

    //---------------------------------------------------------------- Delete version ------------------------------------------------
    async deleteVersion(versionID:string): Promise<number>{
        try {
            let version = await this.getVersion(versionID)
            await Project_Version.destroy({where:{id:versionID}})
            return version.id
        } catch (error) {
            throw error
        }
    }
}

export default VersionRepository