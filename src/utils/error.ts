// import fs from 'fs';

export enum ErrorEnum{
    "Unknown error"=400,
    "UniqueConstraint"=401,
    "NotFound"=404,
    "ForbiddenError"=403
}

class ErrorHandler{
    private static readonly STATUS_ERROR_404:number = 404;
    private static readonly STATUS_ERROR_500:number = 500;
    private static readonly STATUS_ERROR_403:number = 403;
    private static readonly STATUS_ERROR_401:number = 401;
    private static readonly STATUS_ERROR_400:number = 400;

    public fileName:string 

    constructor(file?:string) {
        this.fileName = file;
    }

    public HandleError(error:string):[number,string,string]{ 
        switch (error) {
            case ErrorEnum[404]:
                //code:404
            return [ErrorHandler.STATUS_ERROR_404, "Not Found","Data not found"]
            

            case ErrorEnum[403]:
                //code:403
            return [ErrorHandler.STATUS_ERROR_403, "Forbidden Action","Action is not allowed or there is something you are missing"]

            case ErrorEnum[401]:
                    //code:401
                return [ErrorHandler.STATUS_ERROR_401, "Unauthorized action","Field name should be unique"]
            
            case ErrorEnum[400]:
                    //code:400
                return [ErrorHandler.STATUS_ERROR_400, "Unknown Error","Contact Support for clarification"]

            default:
                //code:500
                return [ErrorHandler.STATUS_ERROR_500, "Internal Server Error","This is on us, Sorry!"]
                
        }
    }
    
    
}

export default ErrorHandler