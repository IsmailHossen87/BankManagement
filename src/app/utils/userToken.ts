import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../config/env";
import AppError from "../errorHelper/AppError";
import { IUser } from "../models/user/user.interface";
import { User } from "../models/user/user.model";
import { generateToken, verifyToken } from "./jwt"; 
import httpStatus from "http-status-codes";

export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    const accessToken = generateToken(jwtPayload, envVar.JWT_ACCESS_SECRET, envVar.JWT_ACCESS_EXPIRES)

    const refreshToken = generateToken(jwtPayload, envVar.JWT_REFRESH_SECRET, envVar.JWT_REFRESH_EXPIRES)

    return {
        accessToken,
        refreshToken
    }
}

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {

    const verifiedRefreshToken = verifyToken(refreshToken, envVar.JWT_REFRESH_SECRET) as JwtPayload


    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }


    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }
    const accessToken = generateToken(jwtPayload, envVar.JWT_ACCESS_SECRET, envVar.JWT_ACCESS_EXPIRES)

    return accessToken
}