import { Router } from "express";
import SkillController from "../../controllers/Skills.js";
import FileUpload from "../../middleware/FilesUpload.js";

const SkillRouter = Router()
const controller = new SkillController();
// const fileUpload = new FileUpload()

SkillRouter.post('/',controller.CreateSkill)//create a new Skill

SkillRouter.get('/:id',controller.GetSkill)//get one
SkillRouter.get('/',controller.GetAllSkills)//get all

SkillRouter.put('/:id',controller.UpdateSkill)//update one

SkillRouter.delete('/:id',controller.DeleteSkill)//delete one




export default SkillRouter