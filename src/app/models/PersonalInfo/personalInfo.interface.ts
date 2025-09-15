import { Types } from "mongoose";

export enum IGender {
    male = "male",
    female = "female",
    others = "others"
}

export interface IContract {
    address: string;
    city: string;
    state: string;
    zipCode: string,
}

export interface IPersonalData {
    firstName: string;
    lastName: string;
    phone: string,
    dateofBirth: string;
    gender: IGender;
}
export interface IFinancialData {
    annualIncome: number;
    landOwnershipValue: number;
    electricityBill: number;
    mobileMoneyBalance: number;
    existingLoan: boolean;
    loanAmount?: number;
}
export interface IApprovalDetails {
    loanAmount:string,
    interestateRate:string,
    termMonths:string,
    description:string

}
export interface IPersonalInfo {
    userId?: Types.ObjectId,
    personalData: IPersonalData,
    contact: IContract,
    gender: IGender,
    financialData: IFinancialData,
    status: string;
    creditScore?: number;
    suggestedCreditLimit?: number;
    recentActivity?: {
        action: string;
        date: Date;
    }[];

}