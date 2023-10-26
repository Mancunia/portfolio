import Project_Section,{sectionInput,sectionOutput} from "../models/Project_Section.js";
import ErrorHandler,{ErrorEnum} from "../../utils/error.js";


interface Section_attributes{
    newSection:(sectionData:sectionInput)=>Promise<sectionOutput>;
    getSection:(sectionID:number)=>Promise<sectionOutput>;
    getAllSection:(phaseID:number)=>Promise<sectionOutput[]>;
    updateSection:(sectionID:number,sectionData:sectionInput)=>Promise<sectionOutput>;
    deleteSection:(sectionID:number)=>Promise<void>;
}

class SectionRepository implements Section_attributes{
    private error:ErrorHandler

    constructor(){
        this.error = new ErrorHandler()
    }

    //----------------------------------------------------------------New Section --------------------------------
    async newSection(sectionData:sectionInput):Promise<sectionOutput>{
        try {
            let section = await Project_Section.create(sectionData)
            return section
        } catch (error) {
            throw await this.error.CustomError(ErrorEnum[400],"Could not create section")
        }
    }

    //---------------------------------------------------------------- Get a section --------------------------------
    async getSection(sectionID:number):Promise<sectionOutput>{
        try {
            let section = await Project_Section.findOne({where:{id:sectionID}})
            if(!section) throw await this.error.CustomError(ErrorEnum[404],"Section not found")
            return section
        } catch (error) {
            throw error
        }
    }

    //----------------------------------------------------------------Get all sections ----------------------------------
    async getAllSection(phaseID:number):Promise<sectionOutput[]>{
        try {
            let sections = await Project_Section.findAll({where:{project_phase_id:phaseID}})
            if(!sections) throw await this.error.CustomError(ErrorEnum[404],"Section not found")
            return sections
        } catch (error) {
            throw error
        }
    }

    //-----------------------------------------------------------------Update a section --------------------------------
    async updateSection(sectionID:number,sectionData:sectionInput):Promise<sectionOutput>{
        try {
            let section = await this.getSection(sectionID)
            await(section as Project_Section).update(sectionData)
            return section
            
        } catch (error) {
            throw error
        }
    }

    //---------------------------------------------------------------- Delete a section --------------------------------
    async deleteSection(sectionID:number):Promise<void>{
        try {
            let section = await this.getSection(sectionID)
            await Project_Section.destroy({where:{id:sectionID}})
            return
        } catch (error) {
            throw error
        }
    }
}   

export default SectionRepository