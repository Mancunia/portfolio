import { Router,Request,Response } from 'express'
import RolesRouter from './RolesRoutes.js';
import SkillRouter from './SkillsRoutes.js';
import UserRouter from './UsersRoutes.js';
import Config from '../../../db/config.js';
import UserMiddlware from '../../middleware/User.js';


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

inputRouter.use('/roles', RolesRouter)
inputRouter.use('/skills', SkillRouter)
inputRouter.use('/users',UserMiddlware.CHECK_USER_LOGIN, UserRouter)

export default inputRouter