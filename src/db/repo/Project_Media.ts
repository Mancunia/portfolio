import Media,{MediaInput,MediaOutput} from "../models/Project_Media.js";

interface Media_attributes{
    addMedia:(mediaData:MediaInput)=>Promise<MediaOutput>;
    getMedia:(sectionID:number)=>Promise<MediaOutput>;
    getAllMedia:(sectionID:number)=>Promise<MediaOutput[]>;
    updateMedia:(sectionID:number, mediaData:MediaInput)=>Promise<MediaOutput>;
    deleteMedia:(sectionID:number)=>Promise<void>;
}

class MediaRepository implements Media_attributes{

    //----------------------------------------------------------------New Media --------------------------------
    async addMedia(mediaData:MediaInput):Promise<MediaOutput>{
        try {
            let media = await Media.create(mediaData)
            return media
            
        } catch (error) {
            throw error
        }
    }

    //---------------------------------------------------------------- get a media from the repository ----------------------------------------------------------------

    async getMedia(sectionID:number): Promise<MediaOutput>{
        try {
            let media = await Media.findOne({where:{project_section_id:sectionID}})
            if(!media){
                let notData:MediaOutput={
                    id: 0,
                    project_section_id: 0,
                    media_type: "",
                    media_location: "",
                    media_preferred_width: 0,
                    media_preferred_height: 0,
                    deactivated_at: undefined
                }
                return notData
            }
            return media

        } catch (error) {
            throw error
        }
    }
    //----------------------------------------------------------------get all Media --------------------------------
    async getAllMedia(sectionID:number): Promise<MediaOutput[]>{
        try {
            let media = await Media.findAll({where:{project_section_id:sectionID}})
            if(media.length < 1){
                console.log("No media found")
                let notData:MediaOutput[] = []

                notData.push({
                    id: 0,
                    project_section_id: 0,
                    media_type: "",
                    media_location: "",
                    media_preferred_width: 0,
                    media_preferred_height: 0,
                    deactivated_at: undefined
                })
                return notData
            }
            console.log("media found")
            return media

        } catch (error) {
            throw error
        }
    }

    //------------------------------------------------------------------ Update Media --------------------------------
    async updateMedia(mediaID:number,mediaData:MediaInput): Promise<MediaOutput>{
        try {
            let media = await this.getMedia(mediaID)
            await (media as Media).update(mediaData)
            return media
        } catch (error) {
            throw error
        }
    }

    //----------------------------------------------------------------Delete Media --------------------------------
    async deleteMedia(mediaID:number): Promise<void>{
        try {
            let media = await this.getMedia(mediaID)
            await Media.destroy({where:{id:mediaID}})
            return
        } catch (error) {
            throw error
        }
    }
}

export default MediaRepository