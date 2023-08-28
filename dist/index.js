import express from "express";
import Config, { PORT } from "./db/config.js";
const app = express();
// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//connect to database
(new Config).connectToDBs().then(() => {
    app.emit("ready");
    console.log("DB Connected.......");
}).catch(err => {
    //TODO: Add logging of error here
    app.emit("error");
});
//Start server after connection
app.on("ready", () => {
    try {
        app.listen(PORT, () => console.log(`Server running on ${PORT}...`));
    }
    catch (error) {
        console.log(`Error occurred: ${error.message}`);
    }
});
//# sourceMappingURL=index.js.map