import express, { Application} from "express";
import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";
import cookieParser from "cookie-parser"

import Config from "./db/config.js";
import dbInit from "./db/init.js";
import cors from "cors"
import inputRouter from "./api/input/routes/index.js";

let config = new Config();

const app: Application = express();

Sentry.init({
  dsn: 'https://79c290c498cef34c6eb8f6f2d2787ef2@o4505833456926720.ingest.sentry.io/4505833461252096',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
});


// Sentry request handling
app.use(Sentry.Handlers.requestHandler());


//cors middleware
// uses (middleware)
app.use(cors())


// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Sentry tracer 
app.use(Sentry.Handlers.tracingHandler());

//Routes
app.use("/apiWrite/", inputRouter);


//Sentry Error handler
app.use(Sentry.Handlers.errorHandler());


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

app.on("error", () => {
  //TODO: Handle server error here
})