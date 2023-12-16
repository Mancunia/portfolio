import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from "jsonwebtoken"
import { Request } from 'express';
import { serverSecret,serverLogFile } from './env.js';
import ErrorHandler,{ ErrorEnum } from './error.js';
import {v4 as uuidV4} from "uuid"

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

const errorHandler = new ErrorHandler()
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
    public static Chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$#%*&';

    public static getDate(): String{
        return new Date().toUTCString()
    }

    public static async logger(message: string){
        const file = serverLogFile
        message ="#"+message+"\n"
    
        try {
            fs.appendFile(`${__dirname}-${file}`, message,(err)=>{
                if(err){
                    console.log(err);
                    throw "Writing File"}
            });

        } catch (error) {
            throw error.message
            
        }
    }

    //JSON web Token 

public static async SessionToken(id:string): Promise<string>{
    try {
        return await jwt.sign({id},serverSecret,{
      expiresIn: Utility.SessionMaxAge
  });
    } catch (error) {
       throw await errorHandler.CustomError(ErrorEnum[500],"Try again later 🙏🏼"); 
    }
  
}


public static async DECODE_TOKEN(token:string): Promise<string>{
    //check token
    if(token){
        let back:string = "";
  
        try{
          
            await jwt.verify(token,serverSecret,(err,decodedToken)=>{
            if(err){
                errorHandler.CustomError(ErrorEnum[403],"Invalid Token"); ;
            }
            else{
               
                back=decodedToken.id;
            }
            });
  
            return back;
        }
        catch(error){
            throw error;
        }
  
        }
        
        
   
  }

  public static async GET_DIRECTORY(file:string,dir: string = __dirname): Promise<string> {
    try {
        let directory = await path.join(dir,file);
       
        return directory;
    } catch (error) {
        throw await errorHandler.CustomError(ErrorEnum[500],"Try again later 🙏🏼"); 
    }
  }

  
  public static async genRandCode(size:number = 16):Promise<string>{
    try{
      let result = ""
      for ( let i = 0; i < size ; i++ ) {
          result += Utility.Chars.charAt(Math.floor(Math.random() * Utility.Chars.length));
      }
      if (result.length < size) throw new Error(ErrorEnum[500])
        return result
  }
    catch(error) {
        throw await errorHandler.CustomError(ErrorEnum[500],"Try again later 🙏🏼"); 
    }
  }

  public static async GENERATE_UUID(): Promise<string>{
    try {
        let uuid = await uuidV4()
    
        if(!uuid){
            uuid = await this.genRandCode()
        }

        return uuid
    } catch (error) {
       throw await errorHandler.CustomError(ErrorEnum[500],"Try again later 🙏🏼"); 
    }
  }

  public static FILE_DETAILS(file){
    try {
        let ext = (path.extname(file.name))
        return { extension:ext}
    } catch (error) {
        
    }
  }

   
}

export default Utility