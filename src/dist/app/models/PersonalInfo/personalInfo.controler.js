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
exports.personalInfoControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const personalInfo_service_1 = require("./personalInfo.service");
// Create Profile
const createInformation = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jwtInfo = req.user;
    const personalInfo = yield personalInfo_service_1.personalInfoService.personalInformation(req.body, jwtInfo.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Personal Information created successfully",
        data: personalInfo,
    });
}));
// getMe Profile
const getSingleInformation = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jwtdata = req.user;
    const personalInfo = yield personalInfo_service_1.personalInfoService.getSingleInformation(jwtdata.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Personal Information retrived",
        data: personalInfo,
    });
}));
// getMe All
const getAllInformation = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jwtdata = req.user;
    const query = req.query;
    const result = yield personalInfo_service_1.personalInfoService.getAllInformation(jwtdata, query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All Personal Information retrieved",
        meta: result.meta,
        data: result
    });
}));
// LoadRequest 
const loanRequest = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jwtdata = req.user;
    const { loanAmount } = req.body || {};
    const personalInfo = yield personalInfo_service_1.personalInfoService.updateLoanAmount(jwtdata.userId, loanAmount);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Your Loan Request Successfully",
        data: personalInfo,
    });
}));
// 2️⃣ Admin/manual: change status to approved/rejected
const changeStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = req.user.userId;
    const { id } = req.params;
    const { status } = req.body;
    const updatedInfo = yield personalInfo_service_1.personalInfoService.updateStatus(userId, id, status);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: `Status updated to ${status}`,
        data: updatedInfo
    });
}));
// 2️⃣ Admin/manual: change Approval Details 
const approvalDetails = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { id } = req.params;
    const approvalData = req.body;
    const updatedApproval = yield personalInfo_service_1.personalInfoService.approvalDetails(id, approvalData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: `Approval details updated successfully`,
        data: updatedApproval
    });
}));
// Update Profile
const updateInformaiton = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jwtdata = req.user;
    const personalInfo = yield personalInfo_service_1.personalInfoService.updateInformaiton(jwtdata.userId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Personal Information Update successfully",
        data: personalInfo,
    });
}));
exports.personalInfoControllers = {
    createInformation, updateInformaiton, getSingleInformation, approvalDetails, changeStatus, loanRequest, getAllInformation
};
