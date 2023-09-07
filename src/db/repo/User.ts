import User,{UserInput,UserOutput} from "../models/User.js";
import { ErrorEnum } from "../../utils/error.js";

interface User_attributes{
    newUser:(userData:UserInput)=>Promise<UserOutput>;
    updateUser:(userID:number,newUser:UserInput)=>Promise<UserOutput>
    deleteUser:(userID:number)=>Promise<number>
    getAllUsers:()=>Promise<UserOutput[]>
}

class UserRepository implements User_attributes{
    
    //---------------------------------------------------------------- New User ------------------------
    async newUser(userData: UserInput): Promise<UserOutput>{
        try {
            let users = await this.getAllUsers()

            if (users.length>0) throw new Error(ErrorEnum[403])//There can only be one user

            let user:UserOutput = await User.create(userData)
            return user

        } catch (error) {

            if(error.name === "SequelizeUniqueConstraintError") {
                throw Error(ErrorEnum[401])
                }
                throw error;
        }

    }

    //---------------------------------------------------------------- Get User ------------------------
   private async getUser(userID:number): Promise<UserOutput>{
        try {
            let user = await User.findOne({where:{id:userID}});

            return user
        } catch (error) {
            if(error.name === "SequelizeUniqueConstraintError") {
                throw Error(ErrorEnum[401])
                }
                throw error;
        }
    }

    //---------------------------------------------------------------- Get User ------------------------
   async getAllUsers(): Promise<UserOutput[]>{
    try {
        let user = await User.findAll();

        return user
    } catch (error) {
        if(error.name === "SequelizeUniqueConstraintError") {
            throw Error(ErrorEnum[401])
            }
            throw error;
    }
}

     //---------------------------------------------------------------- Get A User By Email ------------------------
   async getAUserByEmail(userID:string): Promise<UserOutput>{
    try {
        let user = await User.findOne({where:{user_email:userID}});
        if(!user) throw Error(ErrorEnum[404])

        return user
    } catch (error) {
        if(error.name === "SequelizeUniqueConstraintError") {
            throw Error(ErrorEnum[401])
            }
            throw error;
    }
}

    

    //---------------------------------------------------------------- Update User ------------------------
    async updateUser(userID:number, userData:UserInput): Promise<UserOutput>{
        try {
            let user = await this.getUser(userID)

            await (user as User).update(userData)

            return user
            
        } catch (error) {
            if(error.name === "SequelizeUniqueConstraintError") {
                throw Error(ErrorEnum[401])
                }
                throw error;
        }
    }

    async deleteUser(userID: number): Promise<number>{
        try {
            let user = await this.getUser(userID)
            return await User.destroy({where:{id:user.id}})
        } catch (error) {
            if(error.name === "SequelizeUniqueConstraintError") {
                throw Error(ErrorEnum[401])
                }
                throw error;
        }
    }
}


export default UserRepository