import Format,{FormatInput,FormatOutput} from "../models/Format.js";
import ErrorHandler, { ErrorEnum } from "../../utils/error.js";

interface Format_attribute{
    newFormat:(formatData:FormatInput)=>Promise<FormatOutput>;
    getFormat:(formatID:number)=>Promise<FormatOutput>;
    getAllFormats:()=>Promise<FormatOutput[]>
    updateFormat:(formatID:number,formatData:FormatInput)=>Promise<FormatOutput>;
    deleteFormat:(formatID:number)=>Promise<number>;
}

class FormatRepository implements Format_attribute{
    
    private error: ErrorHandler
    constructor(){
        this.error = new ErrorHandler()
    }
    //----------------------------------------------------------------New Format --------------------------------
    async newFormat(formatData: FormatInput): Promise<FormatOutput>{
        try {
            let format = await Format.create(formatData);
            return format
        } catch (error) {
             if(error.name === "SequelizeUniqueConstraintError") {
            throw await this.error.CustomError(ErrorEnum[401],"Format name exist already")
            }
            throw await this.error.CustomError(ErrorEnum[400],"Error creating format")
        }
    }

    //-----------------------------------------Get One --------------------------------------
    async getFormat(formatID:number): Promise<FormatOutput>{
        try {
            let format = await Format.findOne({where: {id: formatID}})

            if(!format)throw await this.error.CustomError(ErrorEnum[404],"Format not found")
            return format
            
        } catch (error) {
            
                throw error;
        }
    }
//--------------------------------------------------------Get All --------------------------------
    async getAllFormats(): Promise<FormatOutput[]>{
        try {
            let format = await Format.findAll()
            if(!format)throw await this.error.CustomError(ErrorEnum[404],"Formats not found")
            return format
            
        } catch (error) {
                throw error;
        }
    }

    //-------------------------------------------------------Update Format -------------------------------
    async updateFormat(formatID: number, formatData: FormatInput):Promise<FormatOutput>{
        try {
            let format = await this.getFormat(formatID)

            await (format as Format).update(formatData)

            return format
            
        } catch (error) {
            if(error.name === "SequelizeUniqueConstraintError") {
                throw await this.error.CustomError(ErrorEnum[401],"Format name exists")
                }
                throw await this.error.CustomError(ErrorEnum[400],"Error updating format")
        }
    }


    //---------------------------------------------------- Delete Format -------------------------------
    async deleteFormat(formatID: number): Promise<number>{
        try {
            let format = await this.getFormat(formatID);

            await Format.destroy({where:{id: formatID}})

            return format.id
            
        } catch (error) {
            throw await this.error.CustomError(ErrorEnum[400],"Format could not be deleted this time")
        }
    }

}

export default FormatRepository