import Format,{FormatInput,FormatOutput} from "../models/Format.js";
import { ErrorEnum } from "../../utils/error.js";

interface Format_attribute{
    newFormat:(formatData:FormatInput)=>Promise<FormatOutput>;
    getFormat:(formatID:number)=>Promise<FormatOutput>;
    getAllFormats:()=>Promise<FormatOutput[]>
    updateFormat:(formatID:number,formatData:FormatInput)=>Promise<FormatOutput>;
    deleteFormat:(formatID:number)=>Promise<number>;
}

class FormatRepository implements Format_attribute{
    
    //----------------------------------------------------------------New Format --------------------------------
    async newFormat(formatData: FormatInput): Promise<FormatOutput>{
        try {
            let format = await Format.create(formatData);
            return format
        } catch (error) {
             if(error.name === "SequelizeUniqueConstraintError") {
            throw Error(ErrorEnum[401])
            }
            throw error;
        }
    }

    //-----------------------------------------Get One --------------------------------------
    async getFormat(formatID:number): Promise<FormatOutput>{
        try {
            let format = await Format.findOne({where: {id: formatID}})

            if(!format)throw new Error(ErrorEnum[404])
            return format
            
        } catch (error) {
            if(error.name === "SequelizeUniqueConstraintError") {
                throw Error(ErrorEnum[401])
                }
                throw error;
        }
    }
//--------------------------------------------------------Get All --------------------------------
    async getAllFormats(): Promise<FormatOutput[]>{
        try {
            let format = await Format.findAll()
            if(!format)throw new Error(ErrorEnum[404])
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
                throw Error(ErrorEnum[401])
                }
                throw error;
        }
    }


    //---------------------------------------------------- Delete Format -------------------------------
    async deleteFormat(formatID: number): Promise<number>{
        try {
            let format = await this.getFormat(formatID);

            await Format.destroy({where:{id: formatID}})

            return format.id
            
        } catch (error) {
            throw error
        }
    }

}

export default FormatRepository