import { Router } from "express";
import SectionController from "../../controllers/Section.js";
import FileUpload from "../../middleware/FilesUpload.js";

const SectionRouter = Router()
const controller = new SectionController()
const middleware = new FileUpload()

SectionRouter.post('/:phase',middleware.CHECK_FILE_EXISTS,middleware.CHECK_FILE_TYPE,middleware.CHECK_FILE_SIZE,controller.CreateSection)//create a new section
SectionRouter.get('/:phase',controller.GetSections)


export default SectionRouter