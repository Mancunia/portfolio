import SkillRepository from "../../db/repo/Skills.js";
import { SkillInput,SkillOutput } from "../../db/models/Skills.js";
import Utility,{loggerStatements} from "../../utils/utilities.js";
import { ErrorEnum } from "../../utils/error.js";

class SkillService {
    private final:string
    private Repo:SkillRepository

    //init
    constructor() {
        this.Repo = new SkillRepository()
    }

    //new skill
    async CreateSkill(skillData:SkillInput):Promise<SkillOutput>{
        try {
            if (!skillData.skill_name)throw new Error(ErrorEnum[403])//missing required attribute

            let skill = await this.Repo.newSkill(skillData);
            
            this.final = `${loggerStatements[1]} ${skill.skill_name} @ ${Utility.getDate()}`

            return skill
        } catch (error) {
            this.final = `${loggerStatements[1]} ${skillData.skill_name} @ ${Utility.getDate()}`
            throw error
        }

        finally{
            //TODO: log error or success
            await Utility.logger(this.final)
        }
    }

    //get skill
    async GetSkill(skillID:number):Promise<SkillOutput>{
        try {
            if(!skillID) throw new Error(ErrorEnum[403])//missing skillID
            let skill = await this.Repo.getSkill(skillID);
            this.final = `${loggerStatements[4]} ${skill.skill_name} @ ${Utility.getDate()}`
            return skill

        } catch (error) {
            this.final = `${loggerStatements[4.1]} skill with ID: ${skillID} @ ${Utility.getDate()}`
            throw error
        }

        finally{
            await Utility.logger(this.final)
        }
    }

    //get all skills
    async GetAllSkills():Promise<SkillOutput[]>{
        try {
            let skills = await this.Repo.getAllSkills()
            this.final = `${loggerStatements[4]} all skills @ ${Utility.getDate()}`
            return skills
        } catch (error) {
            this.final = `${loggerStatements[4.1]} skills @ ${Utility.getDate()}`
            throw error
        }

        finally{
            await Utility.logger(this.final)
        }
    }

    //update skill
    async UpdateSkill(skillID:number,skillData:SkillInput):Promise<SkillOutput>{
        try {
            if(!skillID || !skillData.skill_name) throw new Error(ErrorEnum[403])//missing required parameter
            let skill = await this.Repo.updateSkill(skillID,skillData)

            this.final = `${loggerStatements[2]} skill with id:${skill.id} from ${skillData.skill_name} to ${skill.skill_name} @ ${Utility.getDate()}`
            return skill
            
        } catch (error) {
            this.final = `${loggerStatements[2.1]} skill with id: ${skillID} @ ${Utility.getDate()}`
            throw error
        }
        finally{
            await Utility.logger(this.final)
        }
    }

    //delete a skill
    async DeleteSkill(skillID:number):Promise<number> {
        try {
            if(!skillID) throw new Error(ErrorEnum[403])//missing required parameter
            let skill:number = await this.Repo.deleteSkill(skillID)
            this.final = `${loggerStatements[3]} skill with id:${skillID} @ ${Utility.getDate()}`
            return skill
        } catch (error) {
            this.final = `${loggerStatements[3.1]} skill with id:${skillID} @ ${Utility.getDate()}`
            throw error
        }
        finally{
            await Utility.logger(this.final)
        }
    }

}


export default SkillService