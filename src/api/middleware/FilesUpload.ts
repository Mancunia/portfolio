import {Response,NextFunction } from "express";
import { UploadRequest as UploadWithFileRequest } from "../../utils/utilities.js";
import ErrorHandler,{ErrorEnum} from "../../utils/error.js";
import path from "path";

const errorHandler = new ErrorHandler()
interface FileUpload_attributes{
    CHECK_FILE_EXISTS:(req: UploadWithFileRequest, res: Response, next: NextFunction)=>void;
    CHECK_FILE_SIZE:(req: UploadWithFileRequest, res: Response, next: NextFunction)=>void;
    CHECK_FILE_TYPE:(req: UploadWithFileRequest, res: Response, next: NextFunction)=>void
}
const fileSize = 10
const extension =[".jpg", ".png", ".jpeg",".mp4"]
const size = function (fileSize){
    return fileSize * 1024 * 1024
}

class FileUpload implements FileUpload_attributes {

   async CHECK_FILE_EXISTS(req: UploadWithFileRequest, res: Response, next: NextFunction){
        try {
        if(!req.files) throw new Error(ErrorEnum[400])
        next()
        } catch(error) {
            let err = await errorHandler.HandleError(error,"File is missing");
            res.status(err[0]).json({error:err[1],message:err[2]})
     }
    }

   async CHECK_FILE_TYPE(req: UploadWithFileRequest, res: Response, next: NextFunction){
        try {
            
            const files = req.files.file
            let FileExtensions = []
            console.log("file:",files.length)

            if(files.length > 1){//check multiple files
            files.forEach(file => {
                console.log(file.name)
                    FileExtensions.push(path.extname(file.name))
                
            })
            }else{//check for file extension
                FileExtensions.push(path.extname(files.name))
            }
            console.log('ext:',FileExtensions)

            let allowed = FileExtensions.every(ext => {
                return extension.includes(ext)
            })

            if(!allowed){
                let message = `Only ${extension.toString()} files are allowed`
                res.status(403).json({status:"Forbidden",message})
                return
            }

            next()
        } catch (error) {
            console.log(error)
            let err = await errorHandler.HandleError(error,"Error checking file extensions");
            res.status(err[0]).json({error:err[1],message:err[2]})
        }
    }

    async CHECK_FILE_SIZE(req: UploadWithFileRequest, res: Response, next: NextFunction){
        try {
            console.log("file size exists")
            const files = req.files.file
            let FilesOverSizeLimit = []

            if(files.length > 1){//handle multiple files size
            files.forEach(file => {
                if(file.size > size){
                    FilesOverSizeLimit.push(file.name)
                }
            })
            }else{//handle single file size
                if(files.size > size)FilesOverSizeLimit.push(files.name)
            }

            console.log("files: ",FilesOverSizeLimit)
            if(FilesOverSizeLimit.length){ 
                let overOne = FilesOverSizeLimit.length > 1
                let message = `${overOne? "Files":"File"} ${FilesOverSizeLimit.toString()} ${overOne? "are":"is"} bigger than the allowed size`
                res.status(403).json({status:"Forbiden",message});
                return
            }

            next()
        } catch (error) {
            console.log("error: ",error)
            let err = await errorHandler.HandleError(error,"Error checking file sizes");
            res.status(err[0]).json({error:err[1],message:err[2]})
        }
    }

}

export default FileUpload