/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { personalInfoService } from "./personalInfo.service";
import { JwtPayload } from "jsonwebtoken";

// Create Profile
const createInformation = catchAsync(async (req: Request, res: Response) => { 
  const jwtInfo = req.user as JwtPayload
  const personalInfo = await personalInfoService.personalInformation(req.body,jwtInfo.userId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Personal Information created successfully",
    data: personalInfo,
  });
});
// getMe Profile
const getSingleInformation = catchAsync(async (req: Request, res: Response) => {
  const jwtdata = req.user as JwtPayload
  const personalInfo = await personalInfoService.getSingleInformation(jwtdata.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Personal Information retrived",
    data: personalInfo,
  });
});
// getMe All
const getAllInformation = catchAsync(async (req: Request, res: Response) => {
  const jwtdata = req.user as JwtPayload;
  const query = req.query as Record<string, string>;

  const result = await personalInfoService.getAllInformation(jwtdata, query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Personal Information retrieved",
    meta: result.meta,
    data: result
  });
});

// LoadRequest 
const loanRequest = catchAsync(async (req: Request, res: Response) => {
  const jwtdata = req.user as JwtPayload
  const { loanAmount } = req.body;
  const personalInfo = await personalInfoService.updateLoanAmount(jwtdata.userId, loanAmount);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Your Loan Request Successfully",
    data: personalInfo,
  });
});

// 2️⃣ Admin/manual: change status to approved/rejected
const changeStatus = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (req.user as any).userId;
  const { id } = req.params;
  const { status } = req.body;

  const updatedInfo = await personalInfoService.updateStatus(userId, id, status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Status updated to ${status}`,
    data: updatedInfo
  });
});
// 2️⃣ Admin/manual: change Approval Details 
const approvalDetails = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const { id } = req.params;
  const approvalData = req.body;
  const updatedApproval = await personalInfoService.approvalDetails( id, approvalData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Approval details updated successfully`,
    data: updatedApproval
  });
});

// Update Profile
const updateInformaiton = catchAsync(async (req: Request, res: Response) => {
  const jwtdata = req.user as JwtPayload

  const personalInfo = await personalInfoService.updateInformaiton(jwtdata.userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Personal Information Update successfully",
    data: personalInfo,
  });
});

export const personalInfoControllers = {
  createInformation, updateInformaiton, getSingleInformation, approvalDetails,changeStatus, loanRequest, getAllInformation
};