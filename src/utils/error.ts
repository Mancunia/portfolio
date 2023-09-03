// import fs from 'fs';

export enum ErrorEnum{
    "CustomNotFoundError"= 404,
    "CustomServerError"= 500,
    "CustomForbiddenError" = 403,
}

class ErrorHandler{
    private static readonly STATUS_ERROR_404:number = 404;
    private static readonly STATUS_ERROR_500:number = 500;
    private static readonly STATUS_ERROR_403:number = 403;

    public fileName:string 

    constructor(file?:string) {
        this.fileName = file;
    }

    public HandleError(message:any):[number,string]{
        switch (message) {
            case ErrorEnum[404]:
            case "SequelizeValidationError":
            case "404": 
                //code:
            return [ErrorHandler.STATUS_ERROR_404, "Not Found"]

            case ErrorEnum[403]:
            case ErrorEnum.CustomForbiddenError:
            case "403": 
                //code:
            return [ErrorHandler.STATUS_ERROR_403, "Forbidden"]

            default:
                //code:
                return [ErrorHandler.STATUS_ERROR_500, "Internal Server Error"]
        }
    }
    
    
}

export default ErrorHandler