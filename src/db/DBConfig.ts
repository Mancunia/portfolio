import { Dialect,Sequelize } from "sequelize";
import { dbName,dbUser,dbPassword,dbDriver,dbHost } from "../utils/env.js";

export const ALLOWED:string[] = JSON.parse(process.env.ALLOWED_HOSTS as string)

class Config {
  

  private sequelizeConnection: Sequelize

  constructor() {
    this.sequelizeConnection = new Sequelize(dbName,dbUser,dbPassword,{
      host:dbHost,
      dialect:dbDriver as Dialect,
      logging:true
    })
  } 


 public async connectToDBs():Promise<boolean>{
    try {
        this.sequelizeConnection
          .authenticate()
          .then(() => {
            // dbInit();
          })
          .catch((error) => {
            throw error
          });
         
          return true
        
    } catch (error) {
        //TODO: Handle error here with error handling module
        console.error("Error connecting to database", error)
    }
  }

   getDatabaseConnection():Sequelize{
    return this.sequelizeConnection
  }

  // public static getDatabaseConnection(): Sequelize {
  //   if (!Config.SingleInstanceSequelize) {
  //     Config.SingleInstanceSequelize = new Config()
  //   }

  //   return Config.SingleInstanceSequelize
  // }
}

export const singleInstance = new Config()
export default Config;
