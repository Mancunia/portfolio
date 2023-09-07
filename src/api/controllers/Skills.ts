import ErrorHandler from "../../utils/error.js";
import SkillService from "../services/Skills.js";
import { Request,Response } from "express";
let errorHandler = new ErrorHandler();
let skillService = new SkillService();

class SkillController{

    async CreateSkill(req: Request, res: Response){//create skill
        try {
            let skill = await skillService.CreateSkill(req.body);
            res.status(201).json(skill);
        } catch (error) {
            let errors:[number,string,string?] = errorHandler.HandleError(error.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async UpdateSkill(req: Request, res: Response){//update skill
    try {
        let skillID = Number(req.params.id);
        let skill = req.body
        skill = await skillService.UpdateSkill(skillID, skill);

        res.status(200).json(skill);

    } catch (error) {
        let errors:[number,string,string?] = errorHandler.HandleError(error.message)
        res.status(errors[0]).json({error: errors[1],message:errors[2]})
    }
    }


    async GetSkill(req:Request,res:Response){//Get a Skill
        try{
        let skillID = Number(req.params.id)
        let skill = await skillService.GetSkill(skillID)
            res.status(200).json(skill)
        }catch(error){
            let errors:[number,string,string?] = errorHandler.HandleError(error.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async GetAllSkills(req:Request,res:Response){//Get all skills
        try {
            let skills = await skillService.GetAllSkills()
            res.status(200).json(skills)
            
        } catch (error) {
            let errors:[number,string,string?] = errorHandler.HandleError(error.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }

    }

    async DeleteSkill(req:Request,res:Response){//Delete skill
        try{
            let skill = Number(req.params.id);
            skill = await skillService.DeleteSkill(skill)

            res.status(200).json(skill)

        }catch(error){
            let errors:[number,string,string?] = errorHandler.HandleError(error.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }

    }
}

export default SkillController;