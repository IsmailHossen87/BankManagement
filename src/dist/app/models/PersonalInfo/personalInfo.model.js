"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalData = void 0;
const mongoose_1 = require("mongoose");
const UserProfileSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
    personalData: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        gender: { type: String },
    },
    contact: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
    },
    financialData: {
        annualIncome: { type: Number, required: true },
        landOwnershipValue: { type: Number, default: 0 },
        electricityBill: { type: Number, default: 0 },
        mobileMoneyBalance: { type: Number, default: 0 },
        existingLoan: { type: Number, default: 0 },
        loanAmount: { type: Number, default: 0 },
    },
    creditScore: { type: Number, },
    suggestedCreditLimit: { type: Number, default: null },
    status: {
        type: String,
        default: "Pending"
    },
    approvalDetails: {
        loanAmount: { type: Number, default: 0 },
        interestateRate: { type: Number, defaule: 0 },
        termMonths: { type: String, default: "" },
        description: { type: String, default: "" }
    }
}, { timestamps: true, versionKey: false });
exports.PersonalData = (0, mongoose_1.model)("PersonalData", UserProfileSchema);
