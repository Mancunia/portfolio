import UserRepository from "../../db/repo/User.js";
import { UserInput,UserOutput } from "../../db/models/User.js";
import Utility,{loggerStatements} from "../../utils/utilities.js";
import { ErrorEnum } from "../../utils/error.js";

interface userRequests {
    user_name: string;
    user_password?: string;
    new_password?: string;
}

class UserService{
    private Repo: UserRepository;
    private final:string

    constructor(){
        this.Repo = new UserRepository();
    }

    async CreateUser(userData: UserInput): Promise<UserOutput>{//Create User
        try {
            if(!userData.user_name || !userData.user_email || !userData.user_password) throw new Error(ErrorEnum[403])
            let user = await this.Repo.newUser(userData);

            this.final = `${loggerStatements[1]} ${user.user_name} @ ${Utility.getDate()}`
            return user
            
        } catch (error) {
            this.final = `${loggerStatements[1.1]} ${userData.user_name} @ ${Utility.getDate()}`
            throw error;
        }
        finally{
            await Utility.logger(this.final)
        }
    }

    // async Login(userID:userRequests):Promise<UserOutput>{//Fetch User
    //     try {
    //         if(!userID) throw new Error(ErrorEnum[403]);
    //         let user = await this.Repo.getUser(userID);
    //         this.final = `${loggerStatements[2]} ${user.user_name} @ ${Utility.getDate()}`

    //         return user
            
    //     } catch (error) {
    //         this.final = `${loggerStatements[2.1]} ${userID} @ ${Utility.getDate()}`
    //         throw error;
    //     }
    //     finally{
    //         await Utility.logger(this.final)
    //     }
    // }

}