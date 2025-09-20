import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { UserService } from "./user.service";
import { JwtPayload } from "jsonwebtoken";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user,
    })
})

const getME = catchAsync(async (req: Request, res: Response) => {
  const jwtdata = req.user as JwtPayload
  const personalInfo = await UserService.getMe(jwtdata.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Retrived Successfully",
    data: personalInfo,
  });
});

export const UserControllers = {
    createUser,getME
}