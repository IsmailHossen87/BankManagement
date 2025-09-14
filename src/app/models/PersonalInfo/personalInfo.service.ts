import AppError from "../../errorHelper/AppError";
import { User } from "../user/user.model";
import { IPersonalInfo } from "./personalInfo.interface";
import httpStatus from "http-status-codes";
import { PersonalData } from "./personalInfo.model"; // Schema import ঠিক করলাম
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { infoSearchableFields } from "./personal.constant";


const calculateCreditScore = (
  annualIncome: number,
  landOwnershipValue: number,
  electricityBill: number,
  mobileMoneyBalance: number
): {
  score: number;
  remaining: number;
  category: string;
  debtToIncomeRatio: string;
  monthlyIncome: number;
  totalDebt: number;
} => {
  // calculation Part
  const monthlyIncome = (annualIncome + landOwnershipValue) / 12;
  const totalDebt = electricityBill + mobileMoneyBalance;

  const remaining = monthlyIncome - totalDebt;

  // Debt-to-Income Ratio (%) with 2 decimal points
  const debtToIncomeRatio =
    monthlyIncome > 0
      ? ((totalDebt / monthlyIncome) * 100).toFixed(2) + "%"
      : "0%";

  if (remaining <= 0) {
    return {
      score: 0,
      remaining,
      category: "Very Poor",
      debtToIncomeRatio,
      monthlyIncome,
      totalDebt,
    };
  }

  // Score scaled out of 100 (cap at 100)
  let score = (remaining / 100000) * 100;
  if (score > 100) score = 100;

  // Category mapping
  let category = "Very Poor";
  if (remaining >= 100000) category = "Excellent";
  else if (remaining >= 50000) category = "Good";
  else if (remaining >= 30000) category = "Fair";
  else if (remaining >= 10000) category = "Poor";

  return {
    score: Number(score.toFixed(2)),
    remaining,
    category,
    debtToIncomeRatio,
    monthlyIncome,
    totalDebt,
  };
};

const personalInformation = async (payload: Partial<IPersonalInfo>) => {
  const isUserExist = await User.findById(payload?.userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const {
    annualIncome = 0,
    landOwnershipValue = 0,
    electricityBill = 0,
    mobileMoneyBalance = 0,
  } = payload.financialData || {};

  // Generate Credit Score + Category + DTI
  const { score } = calculateCreditScore(
    annualIncome,
    landOwnershipValue,
    electricityBill,
    mobileMoneyBalance
  );

  payload.creditScore = score;

  // DB তে সেভ
  const result = await PersonalData.create(payload);
  return result;
};

// get PersonalInformation
const getSingleInformation = async (userId: string) => {
  const userInfo = await User.findById(userId);

  if (!userInfo) {
    throw new AppError(httpStatus.NOT_FOUND, "You are not valid User");
  }
  const personalInfo = await PersonalData.find({ userId })
  return personalInfo
};
// getAll PersonalInformation
const getAllInformation = async (jwtInfo: JwtPayload, query: Record<string, string>) => {

  const user = await User.findById(jwtInfo.userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (jwtInfo.role !== "ADMIN") {
    throw new AppError(httpStatus.FORBIDDEN, "Only permitted Admin")
  }

  // const allPersonalInfo = await PersonalData.find()
  const queryBuilder = new QueryBuilder(PersonalData.find(), query)

  const tours =await queryBuilder
  .search(infoSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    .build();
  const meta = await queryBuilder.getMeta()

  return {
    data: tours,
    meta: meta,
  };

};


// update PersonalInformation
const updateInformaiton = async (userId: string, payload: Partial<IPersonalInfo>) => {
  const userInfo = await User.findById(userId);

  if (!userInfo) {
    throw new AppError(httpStatus.NOT_FOUND, "You are not valid User");
  }
  const infoData = await PersonalData.findOneAndUpdate({ userId }, { $set: payload }, { new: true })
  return infoData
};




export const personalInfoService = {
  personalInformation, updateInformaiton, getSingleInformation, getAllInformation
};
