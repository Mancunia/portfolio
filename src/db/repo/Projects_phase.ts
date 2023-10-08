import Project_Phase,{PhaseInput,PhaseOutput} from "../models/Project_Phase.js";
import ErrorHandler, { ErrorEnum } from "../../utils/error.js";

interface Phase_atttributes{
    newPhase:(phaseData:PhaseInput)=>Promise<PhaseOutput>;
    getPhase:(phaseID:number)=>Promise<PhaseOutput>;
    getAllPhase:(versionID:number)=>Promise<PhaseOutput[]>;
    deletePhase:(phaseID:number)=>Promise<PhaseOutput>;
    updatePhase:(phaseID:number,phaseData:PhaseInput)=>Promise<PhaseOutput>
}

class PhaseRepository implements Phase_atttributes{

    private error: ErrorHandler
    constructor(){
        this.error = new ErrorHandler()
    }
    //---------------------------------------------------------------- New Phase --------------------------------
    async newPhase(phaseData: PhaseInput):Promise<PhaseOutput>{
        try {
            let newPhase = await Project_Phase.create(phaseData)

            return newPhase

        } catch (error) {
             if(error.name === "SequelizeUniqueConstraintError") {
                throw await this.error.CustomError(ErrorEnum[401],"Phase name has to be unique")
                }
                throw await this.error.CustomError(ErrorEnum[400],"Error creating new phase");
        }
    }

    //----------------------------------------------------------------Get Phase --------------------------------
    async getPhase(phaseID:number):Promise<PhaseOutput>{
        try {
            let phase = await Project_Phase.findOne({where:{id: phaseID}})
            if(!phase) throw await this.error.CustomError(ErrorEnum[4044],"Phase not found")

            return phase
            
        } catch (error) {
            throw error
        }
    }

    //---------------------------------------------------------------- Get All Phase --------------------------------
    async getAllPhase(versionID:number):Promise<PhaseOutput[]>{
        try {
            let phases = await Project_Phase.findAll({where:{project_version_id: versionID}})
            if(!phases) throw await this.error.CustomError(ErrorEnum[404],"Phases not Found")

            return phases
            
        } catch (error) {
            throw error
        }
    }

    //----------------------------------------------------------------updatePhase --------------------------------
    async updatePhase(phaseID:number,phaseData:PhaseInput):Promise<PhaseOutput>{
        try {
            let phase = await this.getPhase(phaseID)
            await (phase as Project_Phase).update(phaseData)

            return phase

            
        } catch (error) {
            if(error.name === "SequelizeUniqueConstraintError") {
                throw await this.error.CustomError(ErrorEnum[401],"Phase name has to be unique")
            }
            throw await this.error.CustomError(ErrorEnum[400],"Error creating new phase");
        }
    }

    //---------------------------------------------------------------- deletePhase --------------------------------
    async deletePhase(phaseID:number):Promise<any>{
        try {
            let phase = await this.getPhase(phaseID)
            await Project_Phase.destroy({where:{id: phaseID}})
        } catch (error) {
            throw await this.error.CustomError(ErrorEnum[400],"Error performing action");
        }
    }
}


export default PhaseRepository