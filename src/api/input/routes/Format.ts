import FormatController from "../../controllers/Format.js";
import { Router } from "express";

const FormatRouter = Router();
const controller = new FormatController()

FormatRouter.post('/',controller.CreateFormat)//add a new format
FormatRouter.get('/:id',controller.GetFormat)//get a format
FormatRouter.get('/',controller.GetFormats)//get all formats
FormatRouter.put('/:id',controller.UpdateFormat)//update a format
FormatRouter.delete('/',controller.DeleteFormat)//delete a format

export default FormatRouter
