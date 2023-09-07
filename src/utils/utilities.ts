import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Config from '../db/config.js';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const maxAge = 730*24*60*60;


export enum loggerStatements{
    "Successfully created"=1,
    "Successfully updated"=2,
    "Successfully deleted"=3,
    "Successfully fetched"=4,
    "Successfully logged in"=5,
    "Error creating"=1.1,
    "Error updating"=2.1,
    "Error deleting"=3.1,
    "Error fetching"=4.1,
    "Error logging in"=5.1
}

class Utility{
    public static getDate(): String{
        return new Date().toUTCString()
    }

    public static async logger(message: string){
        const file = Config.File
        message ="#"+message+"\n"
    
        try {
            fs.appendFile(`${__dirname}-${file}`, message,(err)=>{
                if(err){
                    console.log(err);
                    throw "Writing File"}
            });

        } catch (error) {
            this.logger("Internal Error")
            throw error.message
            
        }
    }

    //JSON web Token 

// public static async createToken(id): Promise<string>{

//   return await jwt.sign({id},service.secret,{
//       expiresIn: maxAge
//   });
// }

   
}

export default Utility