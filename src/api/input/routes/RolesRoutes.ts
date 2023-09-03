import { Router} from "express";
import RolesController from "../../controllers/Roles.js";

const controller = new RolesController();
const RolesRouter = Router()

RolesRouter.post('/',controller.CreateRole)//new role

export default RolesRouter