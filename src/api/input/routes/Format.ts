import FormatController from "../../controllers/Format.js";
import { Router } from "express";
import FileUpload from "../../middleware/FilesUpload.js";

const FormatRouter = Router();
const controller = new FormatController()
const fileUpload = new FileUpload()

FormatRouter.post('/',fileUpload.CHECK_FILE_EXISTS,fileUpload.CHECK_FILE_TYPE,fileUpload.CHECK_FILE_SIZE,controller.CreateFormat)//add a new format
FormatRouter.get('/:id',controller.GetFormat)//get a format
FormatRouter.get('/',controller.GetFormats)//get all formats
FormatRouter.put('/:id',controller.UpdateFormat)//update a format
FormatRouter.delete('/',controller.DeleteFormat)//delete a format

export default FormatRouter
