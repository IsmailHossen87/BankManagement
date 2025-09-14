import { model, Schema } from "mongoose";
import {  IRole, IUser } from "./user.interface";
// const personalInfoSchema = new Schema<IPersonalInfo>({
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     phone:{type:String,required:true},
//     dateofBirth: { type: String, required: true },
//     gender: {
//         type: String, enum: Object.values(IGender),
//         default: IGender.male
//     }
// })



// const contractSchema = new Schema<IContract>({
//     address:{type:String,required:true},
//     city:{type:String,required:true},
//     state:{type:String,required:true},
//     zipCode:{type:String,required:true},
// })



const userShcema = new Schema<IUser>({
    email:{type :String,required:true},
    role:{type:String,enum:Object.values(IRole),default:IRole.USER},
    password:{type :String,required:true},
    phone:{type :String,required:true},
},{
      timestamps: true,
    versionKey: false
})

export const User = model<IUser>("User",userShcema)