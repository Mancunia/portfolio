import { Router} from "express";
import RolesController from "../../controllers/Roles.js";

const controller = new RolesController();
const RolesRouter = Router()

RolesRouter.post('/',controller.CreateRole)//new role
RolesRouter.get('/',controller.GetRoles)//Get all roles
RolesRouter.get('/:id',controller.GetRole)//Get a role
RolesRouter.put('/:id',controller.UpdateRole)//Update a role
RolesRouter.delete('/:id',controller.DeleteRole)//Delete

export default RolesRouter