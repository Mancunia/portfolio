import UserRepository from "../../db/repo/User.js";
import { UserInput,UserOutput } from "../../db/models/User.js";
import Utility,{loggerStatements} from "../../utils/utilities.js";
import ErrorHandler, { ErrorEnum } from "../../utils/error.js";
import bcrypt from "bcrypt"

interface userRequests {
    user_name: string;
    user_password?: string;
    new_password?: string;
}

class UserService{
    private Repo: UserRepository;
    private final:string
    private error:ErrorHandler

    constructor(){
        this.Repo = new UserRepository();
        this.error = new ErrorHandler()
    }

    async CreateUser(userData: UserInput): Promise<boolean>{//Create User
        try {
            if(!userData.user_name || !userData.user_email || !userData.user_password) throw await this.error.CustomError(ErrorEnum[403],"Invalid User details")
            
            userData.user_password = await bcrypt.hash(userData.user_password,10)
            let user = await this.Repo.newUser(userData);

            this.final = `${loggerStatements[1]} ${user.user_name} @ ${Utility.getDate()}`
            return true
            
        } catch (error) {
            this.final = `${loggerStatements[1.1]} ${userData.user_name} @ ${Utility.getDate()}`
            throw error;
        }
        finally{
            await Utility.logger(this.final)
        }
    }

    async Login(userID:userRequests):Promise<UserOutput|any>{//Fetch User
        try {
            if(!userID) throw await this.error.CustomError(ErrorEnum[403],"Invalid User ID");
            let user = await this.Repo.getAUserByEmail(userID.user_name);

            //check if user password exists
            if (bcrypt.compareSync(userID.user_password, user.user_password, )) {
                // Passwords match
                let userDetails = {
                    user_name: user.user_name,
                    user_email: user.user_email,
                    user_fullname: `${user.user_firstName} ${user.user_lastName}`
                }
                this.final = `${loggerStatements[5]} ${userID.user_name} @ ${Utility.getDate()}`

                return {userDetails,token:await Utility.SessionToken(user.id)}
               } else {
                // Passwords don't match
                throw new Error(ErrorEnum[403])
               }
            
        } catch (error) {
            this.final = `${loggerStatements[5.1]} ${userID} @ ${Utility.getDate()}`
            throw error;
        }
        finally{
            await Utility.logger(this.final)
        }
    }

}

export default UserService