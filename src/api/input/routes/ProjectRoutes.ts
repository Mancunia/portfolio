import { Router } from "express";
import ProjectController from "../../controllers/Projects.js";
import FileUpload from "../../middleware/FilesUpload.js";

const ProjectRouter = Router()
const controller = new ProjectController()
const middleware = new FileUpload()

ProjectRouter.post('/',middleware.CHECK_FILE_EXISTS,middleware.CHECK_FILE_TYPE,middleware.CHECK_FILE_SIZE,controller.CreateProject)// create project
ProjectRouter.get('/:id',controller.GetProject)
ProjectRouter.get('/',controller.GetAllProjects)
ProjectRouter.put('/:id',middleware.CHECK_FILE_TYPE,middleware.CHECK_FILE_SIZE,controller.UpdateProject)
ProjectRouter.delete('/:id',controller.DeleteProject)

export default ProjectRouter

