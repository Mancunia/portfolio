import { Router } from "express";
import VersionController from "../../controllers/Project_version.js";

const VersionRouter = Router()
const controller = new VersionController()

VersionRouter.post('/:project',controller.CreateVersion)//create a version
VersionRouter.get('/all/:project',controller.GetVersions)//get all versions
VersionRouter.get('/one/:id',controller.GetAVersion)//get a version
VersionRouter.put('/one/:id',controller.UpdateAVersion)//update a version
VersionRouter.delete('/one/:id',controller.DeleteAVersion)//delete a version

export default VersionRouter