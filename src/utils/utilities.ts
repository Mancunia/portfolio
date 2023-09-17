import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from "jsonwebtoken"
import { Request } from 'express';
import Config from '../db/config.js';
import { ErrorEnum } from './error.js';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


export interface UploadRequest extends Request {
    files:any
}

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

    public static SessionMaxAge = 730*24*60*60;//2 years
    public static RefreshMaxAge = 60*24*60;

    public static SESSION = "session";

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

public static async SessionToken(id:string): Promise<string>{

  return await jwt.sign({id},Config.SECRET,{
      expiresIn: Utility.SessionMaxAge
  });
}


public static async DECODE_TOKEN(token:string): Promise<string>{
    //check token
    if(token){
        let back:string = "";
  
        try{
          
            await jwt.verify(token,Config.SECRET,(err,decodedToken)=>{
            if(err){
                throw new Error(ErrorEnum[403]);
            }
            else{
               
                back=decodedToken.id;
            }
            });
  
            return back;
        }
        catch(err){
            throw err;
        }
  
        }
        
        
   
  }

   
}

export default Utility