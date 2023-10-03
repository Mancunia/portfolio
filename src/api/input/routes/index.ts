import { Router,Request,Response } from 'express'
import RolesRouter from './RolesRoutes.js';
import SkillRouter from './SkillsRoutes.js';
import UserRouter from './UsersRoutes.js';
import FormatRouter from './Format.js';
import Config from '../../../db/config.js';
import UserMiddlware from '../../middleware/User.js';
import ProjectRouter from './ProjectRoutes.js';
import VersionRouter from './VersionRoutes.js';


const inputRouter = Router()

inputRouter.get("/", async (req: Request, res: Response): Promise<Response> => {
  
    return res.status(200).json({
      message: 'Welcome to my Portfolio API!',
      endpoints:{
        staging:`http://localhost:${Config.PORT}/apiWrite/`,
        production:'coming soon....'
      },
      version:"1.0"
    });
  });

inputRouter.use('/roles',UserMiddlware.CHECK_USER_LOGIN, RolesRouter)
inputRouter.use('/skills',UserMiddlware.CHECK_USER_LOGIN, SkillRouter)
inputRouter.use('/users',UserMiddlware.CHECK_USER_LOGIN, UserRouter)
inputRouter.use('/formats',UserMiddlware.CHECK_USER_LOGIN, FormatRouter)
inputRouter.use('/projects',UserMiddlware.CHECK_USER_LOGIN, ProjectRouter)
inputRouter.use('/projects/versions',UserMiddlware.CHECK_USER_LOGIN, VersionRouter)

export default inputRouter