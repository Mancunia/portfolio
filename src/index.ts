import express, { Application,Request,Response,NextFunction} from "express";
import Config,{PORT} from "./db/config.js";
import dbInit from "./db/init.js";
import cors from "cors"


const app: Application = express();

//cors middleware
// uses (middleware)
app.use(cors())


// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




//connect to database
(new Config).connectToDBs().then(() => {
    dbInit()
    app.emit("ready");
    console.log("DB Connected.......")
  }).catch(err => {
    //TODO: Add logging of error here
    app.emit("error")
});


//Start server after connection
app.on("ready", () => {
    try {
      app.listen(PORT, () => console.log(`Server running on ${PORT}...`));
    } catch (error) {
      console.log(`Error occurred: ${error.message}`);
    }
  });