import { Router } from "express";
import VersionController from "../../controllers/Project_version.js";

const VersionRouter = Router()
const controller = new VersionController()

VersionRouter.post('/:project',controller.CreateVersion)//create a version


export default VersionRouter