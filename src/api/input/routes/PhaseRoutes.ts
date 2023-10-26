import PhaseController from "../../controllers/Project_phase.js";
import { Router } from "express";

const PhaseRouter = Router();
const controller = new PhaseController();

PhaseRouter.post('/:version',controller.CreatePhase)
PhaseRouter.get('/all/:version',controller.GetAllPhases)
PhaseRouter.get('/one/:version',controller.GetPhase)
PhaseRouter.delete('/:phase',controller.DeletePhase)
PhaseRouter.put('/:phase',controller.UpdatePhase)



export default PhaseRouter