import express, { Application} from "express";
import Config,{PORT} from "./db/config.js";
import dbInit from "./db/init.js";


const app: Application = express();
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