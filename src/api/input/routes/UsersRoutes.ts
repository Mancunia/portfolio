import UserController from "../../controllers/User.js";
import { Router } from "express";

const UserRouter = Router()
const controllers = new UserController()

UserRouter.post('/',controllers.Signup)//create a new user
UserRouter.post('/login',controllers.SignIn)//User login


export default UserRouter