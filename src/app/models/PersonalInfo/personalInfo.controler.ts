/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { personalInfoService } from "./personalInfo.service";
import { JwtPayload } from "jsonwebtoken";

// Create Profile
const createInformation = catchAsync(async (req: Request, res: Response) => {
  const personalInfo = await personalInfoService.personalInformation(req.body);

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

  const result = await personalInfoService.getAllInformation(jwtdata,query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Personal Information retrieved",
    meta: result.meta,
    data: result
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
  createInformation, updateInformaiton, getSingleInformation, getAllInformation
};