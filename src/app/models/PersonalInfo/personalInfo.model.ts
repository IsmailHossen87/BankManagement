import { model, Schema, Types } from "mongoose";
import { IPersonalInfo } from "./personalInfo.interface";

const UserProfileSchema = new Schema<IPersonalInfo>({ 
        userId:{type:Types.ObjectId,ref:"User",required:true},
        personalData: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            dateOfBirth: { type: Date, required: true },
            gender: { type: String },
        },
        contact: {
            address: { type: String, required: true},
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
        },

        financialData: {
            annualIncome: { type: Number, required: true },
            landOwnershipValue: { type: Number, default: 0 },
            electricityBill: { type: Number, default: 0 },
            mobileMoneyBalance: { type: Number, default: 0 },
            existingLoan: { type: Boolean, default: false },
            loanAmount: { type: Number, default: 0 },
        },
        creditScore: { type: Number,  },
        suggestedCreditLimit: { type: Number, default: null },
        status: {
            type: String,
            enum: ["Pending", "Profile Completed", "Score Generated"],
        },
       
    },
    { timestamps: true ,versionKey:false}
);


export const PersonalData = model<IPersonalInfo>("PersonalData",UserProfileSchema)