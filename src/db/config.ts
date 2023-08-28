import { Dialect,Sequelize } from "sequelize";
import "dotenv/config";
import dbInit from "./init.js";

export const PORT = Number(process.env.PORT as string);

console.log(process.env.DB_DRIVER)

class Config {
  private dbName = process.env.DB_NAME as string;
  private dbUser = process.env.DB_USER as string;
  private dbHost = process.env.DB_HOST as string;
  private dbDriver = process.env.DB_DRIVER as Dialect;
  private dbPassword = process.env.DB_PASSWORD as string;

  private sequelizeConnection = new Sequelize(this.dbName,this.dbUser,this.dbPassword,{
    host:this.dbHost,
    dialect:this.dbDriver
  })


//   private mongoDBConnection =  mongoose.connect(this.mongoDB)


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
    }
  }

  getDatabaseConnection():Sequelize{
    return this.sequelizeConnection
  }
}


export default Config;
