import SectionRepository from "../../db/repo/Phase_Section.js";
import { sectionInput,sectionOutput } from "../../db/models/Project_Section.js";
import ErrorHandler,{ErrorEnum} from "../../utils/error.js";
import Utility,{loggerStatements} from "../../utils/utilities.js";
import MediaService from "./Media.js";
import { MediaInput,MediaOutput} from "../../db/models/Project_Media.js";

interface sectionOutputWithFile extends sectionOutput {
    files:any[]
}

class SectionService{

   private repo:SectionRepository
   private error:ErrorHandler
   private media:MediaService
   private final:string
   private dir: string = "./public/"
   
   constructor(){

    this.repo = new SectionRepository()
    this.error = new ErrorHandler()
    this.media = new MediaService()

   }

   async CreateSection(phaseID:number,sectionData:sectionInput,files:any):Promise<{section:sectionOutput,files:MediaOutput[]}>{//Create a new section
    try {
        if(!phaseID) throw await this.error.CustomError(ErrorEnum[403],"Invalid Phase ID ")
        sectionData.project_phase_id = phaseID
        let section = await this.repo.newSection(sectionData)
        console.log("files",files)
        /*
        0.map for a new array with file extension and file name
        1.move files to the project directory
        1.1 if file is moved to the project directory successfully
        1.2 insert file directory into media table
        */
        
    for (const file of files) {
        let {extension} = await Utility.FILE_DETAILS(file)
        let location = await this.MoveFile(file)
        let media:MediaInput = {
            media_type: extension,
            media_location: location
        }

        await this.media.NewMedia(section.id, media)
      }
        this.final =`${loggerStatements[1]} a new section created @ ${Utility.getDate()}`

        return await this.GetSection(section.id)

    } catch (error) {
        this.final =`${loggerStatements[1.1]} a new section created @ ${Utility.getDate()}`
        throw error
    }
    finally{
        Utility.logger(this.final)
    }
   }


   async GetSection(sectionID:number):Promise<{section:sectionOutput,files:MediaOutput[]}>{
    try {
        if(!sectionID) throw await this.error.CustomError(ErrorEnum[403],"Invalid section ID")
        let section = await this.repo.getSection(sectionID)

        let files = await this.media.GetMedia(section.id);
        this.final =`${loggerStatements[4]} section with ID: ${section.id} @ ${Utility.getDate()}`
        return {section,files}
        
    } catch (error) {
        this.final =`${loggerStatements[4]} section with ID: ${sectionID} @ ${Utility.getDate()}`
        throw error
    }
    finally{
        Utility.logger(this.final)
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

export default SectionService