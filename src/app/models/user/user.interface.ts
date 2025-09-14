import { Types } from "mongoose";


export enum IRole {
    ADMIN = "ADMIN",
    USER = "USER",
}

export interface IUser {
    _id?: Types.ObjectId
    email: string,
    role: IRole,
    password: string,
    phone: string
}