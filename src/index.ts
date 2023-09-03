import express, { Application,Request,Response,NextFunction} from "express";
import Config from "./db/config.js";
import dbInit from "./db/init.js";
import cors from "cors"
import inputRouter from "./api/input/routes/index.js";

let config = new Config();

const app: Application = express();

//cors middleware
// uses (middleware)
app.use(cors())


// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/apiWrite/", inputRouter);


//connect to database
config.connectToDBs().then(() => {
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
      app.listen(Config.PORT, () => console.log(`Server running on ${Config.PORT}...`));
    } catch (error) {
      console.log(`Error occurred: ${error.message}`);
    }
  });