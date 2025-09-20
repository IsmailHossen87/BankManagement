"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.personalInfoService = void 0;
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const personalInfo_model_1 = require("./personalInfo.model"); // Schema import ঠিক করলাম
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const personal_constant_1 = require("./personal.constant");
const calculateCreditScore = (annualIncome, landOwnershipValue, electricityBill, mobileMoneyBalance) => {
    // calculation Part
    const monthlyIncome = (annualIncome + landOwnershipValue) / 12;
    const totalDebt = electricityBill + mobileMoneyBalance;
    const remaining = monthlyIncome - totalDebt;
    // Debt-to-Income Ratio (%) with 2 decimal points
    const debtToIncomeRatio = monthlyIncome > 0
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
    if (score > 100)
        score = 100;
    // Category mapping
    let category = "Very Poor";
    if (remaining >= 100000)
        category = "Excellent";
    else if (remaining >= 50000)
        category = "Good";
    else if (remaining >= 30000)
        category = "Fair";
    else if (remaining >= 10000)
        category = "Poor";
    return {
        score: Number(score.toFixed(2)),
        remaining,
        category,
        debtToIncomeRatio,
        monthlyIncome,
        totalDebt,
    };
};
const personalInformation = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const { annualIncome = 0, landOwnershipValue = 0, electricityBill = 0, mobileMoneyBalance = 0, } = payload.financialData || {};
    // Generate Credit Score + Category + DTI
    const { score } = calculateCreditScore(annualIncome, landOwnershipValue, electricityBill, mobileMoneyBalance);
    payload.creditScore = score;
    // DB তে সেভ
    const result = yield personalInfo_model_1.PersonalData.create(Object.assign({ userId }, payload));
    return result;
});
// get PersonalInformation
const getSingleInformation = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield user_model_1.User.findById(userId);
    if (!userInfo) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "You are not valid User");
    }
    const personalInfo = yield personalInfo_model_1.PersonalData.find({ userId });
    return personalInfo;
});
// getAll PersonalInformation
const getAllInformation = (jwtInfo, query) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(jwtInfo.userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (jwtInfo.role !== "ADMIN") {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only permitted Admin");
    }
    // const allPersonalInfo = await PersonalData.find()
    const queryBuilder = new QueryBuilder_1.QueryBuilder(personalInfo_model_1.PersonalData.find(), query);
    const tours = yield queryBuilder
        .search(personal_constant_1.infoSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()
        .build();
    const meta = yield queryBuilder.getMeta();
    return {
        data: tours,
        meta: meta,
    };
});
// update LoanAmount
const updateLoanAmount = (userId, loanAmount) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield user_model_1.User.findById(userId);
    if (!userInfo) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "You are not a valid User");
    }
    const personalInfo = yield personalInfo_model_1.PersonalData.findOne({ userId });
    if (!personalInfo) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Personal Data not found for this user");
    }
    const updatedInfo = yield personalInfo_model_1.PersonalData.findOneAndUpdate({ userId }, {
        $set: {
            "financialData.loanAmount": loanAmount,
            status: "pernding"
        }
    }, { new: true, runValidators: true });
    return updatedInfo;
});
// update ApprovalRequest
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const approvalDetails = (personalId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const personalInfo = yield personalInfo_model_1.PersonalData.findById(personalId);
    if (!personalInfo) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Personal Data not found");
    }
    const updatedInfo = yield personalInfo_model_1.PersonalData.findByIdAndUpdate(personalId, {
        $set: {
            approvalDetails: {
                loanAmount: payload.loanAmount,
                termMonths: payload.termMonths,
                description: payload.description,
            },
        },
    }, { new: true, runValidators: true });
    return updatedInfo;
});
// status Update
const updateStatus = (userId, infoId, status) => __awaiter(void 0, void 0, void 0, function* () {
    // check if user exists
    const userInfo = yield user_model_1.User.findById(userId);
    if (!userInfo) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Invalid user");
    }
    const updatedInfo = yield personalInfo_model_1.PersonalData.findByIdAndUpdate(infoId, { $set: { status } }, { new: true, runValidators: true });
    if (!updatedInfo) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Personal Data not found for this ID");
    }
    return updatedInfo;
});
// update PersonalInformation
const updateInformaiton = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield user_model_1.User.findById(userId);
    if (!userInfo) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "You are not valid User");
    }
    const infoData = yield personalInfo_model_1.PersonalData.findOneAndUpdate({ userId }, { $set: payload }, { new: true });
    return infoData;
});
exports.personalInfoService = {
    personalInformation, updateInformaiton, updateLoanAmount, approvalDetails, getSingleInformation, getAllInformation, updateStatus
};
