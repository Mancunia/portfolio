import PhaseController from "../../controllers/Project_phase.js";
import { Router } from "express";

const PhaseRouter = Router();
const controller = new PhaseController();

PhaseRouter.post('/:version',controller.CreatePhase)


export default PhaseRouter