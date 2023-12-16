import "dotenv/config";

    export const dbName = process.env.DB_NAME as string;
  export const dbUser = process.env.DB_USER as string;
  export const dbHost = process.env.DB_HOST as string;
  export const dbDriver = process.env.DB_DRIVER as string;
  export const dbPassword = process.env.DB_PASSWORD as string;

   export const serverPort = Number(process.env.PORT as string);
    export const serverLogFile = process.env.FILE as string;
   export const serverSecret = process.env.SECRET as string;
   export const serverENV = process.env.NODE_ENV as string;