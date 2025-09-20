"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
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
const userShcema = new mongoose_1.Schema({
    email: { type: String, required: true },
    role: { type: String, enum: Object.values(user_interface_1.IRole), default: user_interface_1.IRole.USER },
    password: { type: String, required: true },
    phone: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false
});
exports.User = (0, mongoose_1.model)("User", userShcema);
