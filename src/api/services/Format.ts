import FormatRepository from "../../db/repo/Format.js";
import { FormatInput,FormatOutput } from "../../db/models/Format.js";
import Utility,{loggerStatements} from "../../utils/utilities.js";
import ErrorHandler, { ErrorEnum } from "../../utils/error.js";


class FormatService{
    private Repo: FormatRepository;
    private dir: string = "./public/"
    private final:string = "";
    private error: ErrorHandler

    constructor(){
        this.Repo = new FormatRepository();
        this.error = new ErrorHandler()
    }

    /*
    0. move file first
    1. return file location
    2. update formatData with file location
    3. post formatData
    */
    async CreateFormat(formatData:FormatInput,file:any = undefined): Promise<FormatOutput>{//new format
        try {
            if(!formatData.format_name) throw await this.error.CustomError(ErrorEnum[403],"Invalid format data")

            if(file){
                formatData.format_icon = await this.MoveFile(file)
            }
            let format = await this.Repo.newFormat(formatData);

            this.final = `${loggerStatements[1]} new Format ${format.format_name} @ ${Utility.getDate()}`
            return format
            
        } catch (error) {
            this.final = `${loggerStatements[1.1]} new Format ${formatData.format_name} @ ${Utility.getDate()}`
            throw error
        }

        finally {
            await Utility.logger(this.final)
        }
    }

    async GetFormat(formatID:number):Promise<FormatOutput>{//fetch a format
        try {
            if(!formatID)throw await this.error.CustomError(ErrorEnum[403],"Invalid format ID")
            let format = await this.Repo.getFormat(formatID)

            this.final = `${loggerStatements[2]} Format ${format.format_name} @ ${Utility.getDate()}`
            return format
        } catch (error) {
            this.final = `${loggerStatements[2.1]} Format: ${formatID} @ ${Utility.getDate()}`
            throw error
            
        }
        finally{
            await Utility.logger(this.final)
        }
    }


    async GetFormats():Promise<FormatOutput[]>{//get all formats
        try {
            let formats = await this.Repo.getAllFormats()
            this.final = `${loggerStatements[2]} ${formats.length} formats @ ${Utility.getDate()}`
            return formats
        } catch (error) {
            this.final = `${loggerStatements[2.1]} all formats @ ${Utility.getDate()}`
            throw error
        }
        finally{
            await Utility.logger(this.final)
        }
    }

    async UpdateFormat(formatID:number,formatData:FormatInput,file:any = undefined):Promise<FormatOutput>{//update format
    try {
        if (!formatID || !formatData.format_name) throw await this.error.CustomError(ErrorEnum[403],"Invalid format data")
        if(file){
            formatData.format_icon = await this.MoveFile(file)
        }
        let format = await this.Repo.updateFormat(formatID,formatData);
        this.final = `${loggerStatements[4]} ${format.format_name} formats @ ${Utility.getDate()}`
        return format
        
    } catch (error) {
        this.final = `${loggerStatements[4.1]} format: ${formatID} @ ${Utility.getDate()}`
        throw error
    }
    finally{
        await Utility.logger(this.final)
    }
    }

    async DeleteFormat(formatID:number):Promise<number>{//delete format
        try {
            if(!formatID) throw await this.error.CustomError(ErrorEnum[403],"Invalid format data")
            formatID = await this.Repo.deleteFormat(formatID)
            this.final = `${loggerStatements[3]} format: ${formatID} @ ${Utility.getDate()}`
            return formatID
            
        } catch (error) {
            this.final = `${loggerStatements[3.1]} format: ${formatID} @ ${Utility.getDate()}`
            throw error
        }
        finally{
            await Utility.logger(this.final)
        }
    }

    private async MoveFile(file:any): Promise<string> {
        try {
            let fileLocation = await Utility.GET_DIRECTORY(file.name,this.dir)
                console.log('fileLocation:',fileLocation)
                file.mv(fileLocation,(err)=>{
                    if(err)throw this.error.CustomError(ErrorEnum[500],"Error moving file")
                })
                return fileLocation
            
        } catch (error) {
            throw new Error(ErrorEnum[500]);
        }
    }


}

export default FormatService