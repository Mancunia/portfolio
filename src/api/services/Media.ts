import MediaRepository from "../../db/repo/Project_Media.js";
import ErrorHandler,{ErrorEnum} from "../../utils/error.js";
import { MediaInput,MediaOutput } from "../../db/models/Project_Media.js";
import Utility,{loggerStatements} from "../../utils/utilities.js";

class MediaService{
    private repo:MediaRepository
    private final:string
    private error:ErrorHandler

    constructor(){
        this.repo = new MediaRepository()
        this.error = new ErrorHandler()
    }

    async NewMedia(sectionID:number,mediaData:MediaInput):Promise<MediaOutput>{//Add a new media
        try {
            if(!sectionID)throw await this.error.CustomError(ErrorEnum[403],"sectionID must be specified")
            mediaData.project_section_id = sectionID
            let media = await this.repo.addMedia(mediaData)
            this.final =`${loggerStatements[1]} add a new media for section with ID: ${sectionID} @ ${Utility.getDate()}`
            return media
        } catch (error) {
            this.final =`${loggerStatements[1.1]} add a new media for section with ID: ${sectionID} @ ${Utility.getDate()}`
            throw error
        }
        finally{
            await Utility.logger(this.final)
        }
    }

    async GetMedia(sectionID:number):Promise<MediaOutput[]>{//get all media
        try {
            if(!sectionID)throw await this.error.CustomError(ErrorEnum[403],"sectionID must be specified")
            let media = await this.repo.getAllMedia(sectionID)
            
            this.final =`${loggerStatements[4]} media for section with ID: ${sectionID} @ ${Utility.getDate()}`
            console.log('media:',media)
            return media
            
        } catch (error) {
            this.final =`${loggerStatements[4.1]} get a new media for section with ID: ${sectionID} @ ${Utility.getDate()}`
            throw error
        }
        finally{
            Utility.logger(this.final)
        }
    }

    async UpdateMedia(mediaID:number,mediaData:MediaInput):Promise<MediaOutput>{
        try {
            if(!mediaID)throw await this.error.CustomError(ErrorEnum[403],"media ID must be specified")
            let media = await this.repo.updateMedia(mediaID,mediaData)
            this.final = `${loggerStatements[2]} media with ID: ${mediaID} @ ${Utility.getDate()}`
            return media
        } catch (error) {
            this.final = `${loggerStatements[2.1]} media with ID: ${mediaID} @ ${Utility.getDate()}`
            throw error
        }
        finally{
           Utility.logger(this.final) 
        }
    }
}

export default MediaService