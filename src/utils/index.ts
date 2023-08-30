import { ALLOWED } from "../db/config.js"

export let corsOptions = {
    origin: function (origin, callback) {
      if (ALLOWED.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }