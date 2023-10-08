import PhaseRepository from "../../db/repo/Projects_phase.js";
import { PhaseInput,PhaseOutput } from "../../db/models/Project_Phase.js";
import Utility,{loggerStatements} from "../../utils/utilities.js";
import ErrorHandler,{ ErrorEnum } from "../../utils/error.js";
import VersionService from "./Project_Versions.js";


class PhaseService {
    private Repo: PhaseRepository;
    private versionService: VersionService;
    private final:string
    private error:ErrorHandler

    constructor(){
        this.Repo = new PhaseRepository()
        this.error = new ErrorHandler()
        this.versionService = new VersionService()
    }

    async CreatePhase(versionID: string, phaseData:PhaseInput):Promise<PhaseOutput>{//create a new phase
        try {
            if(!versionID) throw await this.error.CustomError(ErrorEnum[403],"Invalid version")
            if(!phaseData.phase_name) throw await this.error.CustomError(ErrorEnum[403],"Invalid phase name")

            phaseData.project_version_id = (await this.getVerison(versionID)).id

            let phase = await this.Repo.newPhase(phaseData)
            this.final= `${loggerStatements[1]} a new phase for version ${versionID} @ ${Utility.getDate()}`
            return phase
            
        } catch (error) {
            this.final= `${loggerStatements[1.1]} a new phase for version ${versionID} @ ${Utility.getDate()}`
            throw error
        }
        finally{
            await Utility.logger(this.final)
        }
    }

    async GetPhase(phaseID:number){//get a phase
        try {
            if (!phaseID) throw this.error.CustomError(ErrorEnum[403],"Invalid phase");
            let phase = await this.Repo.getPhase(phaseID)
            this.final= `${loggerStatements[4]} phase with id ${phaseID} @ ${Utility.getDate()}`
            return phase
            
        } catch (error) {
            this.final= `${loggerStatements[4.1]} a phase with id ${phaseID} @ ${Utility.getDate()}`
            throw error
        }
        finally{
            await Utility.logger(this.final)
        }
    }

    async GetAllPhase(versionID:string){//get all phases
        try {
            if (!versionID) throw this.error.CustomError(ErrorEnum[403],"Invalid version");
            let phases = await this.Repo.getAllPhase( (await this.getVerison(versionID)).id)

            this.final= `${loggerStatements[4]} all phases for version with id ${versionID} @ ${Utility.getDate()}`
            return phases
        } catch (error) {
            this.final= `${loggerStatements[4.1]} all phases for version with id ${versionID} @ ${Utility.getDate()}`
            throw error
        }
        finally{
            await Utility.logger(this.final)
        }
    }

    async UpdatePhase(phaseID:number,phaseData:PhaseInput):Promise<PhaseOutput>{//Update a phase
        try {
            if (!phaseID) throw this.error.CustomError(ErrorEnum[403],"Invalid phase");// if no phaseID is passed
            if (phaseData.project_version_id || phaseData?.id) throw this.error.CustomError(ErrorEnum[403],"Action is strictly forbidden"); // primary is passed
            let phase = await this.Repo.updatePhase(phaseID,phaseData)
            this.final= `${loggerStatements[2]} phase with id ${phaseID} @ ${Utility.getDate()}`
            return phase
        } catch (error) {
            this.final= `${loggerStatements[2.1]} phase with id ${phaseID} @ ${Utility.getDate()}`
            throw error
        }
        finally{
            await Utility.logger(this.final)
        }

    }

    async DeletePhase(phaseID:number):Promise<void> {
        try {
            if (!phaseID) throw this.error.CustomError(ErrorEnum[403],"Invalid phase");// if no phaseID is passed
            await this.Repo.deletePhase(phaseID)
            this.final= `${loggerStatements[3]} phase with id ${phaseID} @ ${Utility.getDate()}`
            return 
        } catch (error) {
            this.final= `${loggerStatements[3.1]} phase with id ${phaseID} @ ${Utility.getDate()}`
            throw error
        }
        finally{
            Utility.logger(this.final)
        }
    }

    protected async getVerison(versionID: string):Promise<any>{
        try {
            let version = await this.versionService.GetVersion(versionID)
            return version
            
        } catch (error) {
            throw error
        }
    }
}

export default PhaseService