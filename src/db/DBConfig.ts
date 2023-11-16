import { Dialect,Sequelize } from "sequelize";
import "dotenv/config";

export const ALLOWED:string[] = JSON.parse(process.env.ALLOWED_HOSTS as string)

class Config {
  static dbName = process.env.DB_NAME as string;
  static dbUser = process.env.DB_USER as string;
  static dbHost = process.env.DB_HOST as string;
  static dbDriver = process.env.DB_DRIVER as Dialect;
  static dbPassword = process.env.DB_PASSWORD as string;

  public static PORT = Number(process.env.PORT as string);
  public static File = process.env.FILE as string;
  public static SECRET = process.env.SECRET as string;
  public static ENVIRONMENT = process.env.NODE_ENV as string;

  private sequelizeConnection: Sequelize

  constructor() {
    this.sequelizeConnection = new Sequelize(Config.dbName,Config.dbUser,Config.dbPassword,{
      host:Config.dbHost,
      dialect:Config.dbDriver,
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
