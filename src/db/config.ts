import { ARRAY, Dialect,Sequelize } from "sequelize";
import "dotenv/config";

export const PORT = Number(process.env.PORT as string);
export const ALLOWED:string[] = JSON.parse(process.env.ALLOWED_HOSTS as string)

class Config {
  private dbName = process.env.DB_NAME as string;
  private dbUser = process.env.DB_USER as string;
  private dbHost = process.env.DB_HOST as string;
  private dbDriver = process.env.DB_DRIVER as Dialect;
  private dbPassword = process.env.DB_PASSWORD as string;

  private sequelizeConnection: Sequelize = new Sequelize(this.dbName,this.dbUser,this.dbPassword,{
      host:this.dbHost,
      dialect:this.dbDriver
    })

  constructor() {

  } 


 async connectToDBs():Promise<boolean>{
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
}


export default Config;
