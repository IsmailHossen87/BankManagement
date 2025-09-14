import AppError from "../../errorHelper/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs"
import { envVar } from "../../config/env";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload
    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }

    const hashPassword = await bcryptjs.hash(password as string, Number(envVar.BCRYPT_SALT_ROUND))
    const user = await User.create({
        email,
        password: hashPassword,
        ...rest
    })
    return user

}
// const  updateUser = async (payload: Partial<IUser>) => {
   
//     return user

// }

export const UserService = { createUser }