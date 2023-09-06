import Skill,{SkillInput,SkillOutput} from "../models/Skills.js";
import { ErrorEnum } from "../../utils/error.js";

interface Skills_attributes{
    newSkill:(skill:SkillInput)=>Promise<SkillOutput>;
    updateSkill:(skillID:number,skill:SkillInput)=>Promise<SkillOutput>;
    getSkill:(skillID:number)=>Promise<SkillOutput>;
    getAllSkills:(skillID:number)=>Promise<SkillOutput[]>;
    deleteSkill:(skillID:number)=>Promise<number>;
}

class SkillRepository implements Skills_attributes{
    //properties
   
    //---------------------------------------------------------------- ADD SKILL ------------------------------------------------
    async newSkill(skill: SkillInput):Promise<SkillOutput>{
        try {
            let newSkill:SkillOutput = await Skill.create(skill)
            return newSkill   
        } catch (error) {
            if(error.name === "SequelizeUniqueConstraintError") {
                throw Error(ErrorEnum[401])
                }
                throw error;
        }

    }

    //----------------------------------------------Get SKILL ----------------------------------------------------

    async getSkill(skillID: number):Promise<SkillOutput>{
        try{
            let skill:SkillOutput = await Skill.findOne({where:{id:skillID}})
            if(!skill) throw Error(ErrorEnum[404])
            return skill;
        }
        catch (error) {
            throw error
        }
    }

    //---------------------------------------------- Update SKILL ----------------------------------------------------
    async updateSkill(skillID:number,skillData:SkillInput):Promise<SkillOutput>{
        try {
            let skill = await this.getSkill(skillID);
            await (skill as Skill).update(skillData)
            return skill;
            
        } catch (error) {
            if(error.name === "SequelizeUniqueConstraintError") {
                throw Error(ErrorEnum[401])
                }
            throw error;
        }
    }

    //---------------------------------------------- GET ALl SKILLS ----------------------------------------------------

    async getAllSkills():Promise<SkillOutput[]>{
        try {
            let skills = await Skill.findAll();
            if(!skills) throw Error(ErrorEnum[404])
            return skills
        } catch (error) {
            throw error
        }
    }

    //---------------------------------------------- Delete SKILL ----------------------------------------------------
    async deleteSkill(skillID:number):Promise<number>{
        try {
            let skill = await this.getSkill(skillID)
            if(!skill) throw Error(ErrorEnum[404])

            return await Skill.destroy({where:{id:skillID}})
        } catch (error) {
            throw error
        }
    }

}


export default SkillRepository