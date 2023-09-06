import { Router } from "express";
import SkillController from "../../controllers/Skills.js";

let SkillRouter = Router()
let controller = new SkillController();

SkillRouter.post('/',controller.CreateSkill)//create a new Skill

SkillRouter.get('/:id',controller.GetSkill)//get one
SkillRouter.get('/',controller.GetAllSkills)//get all

SkillRouter.put('/:id',controller.UpdateSkill)//update one

SkillRouter.delete('/:id',controller.DeleteSkill)//delete one




export default SkillRouter