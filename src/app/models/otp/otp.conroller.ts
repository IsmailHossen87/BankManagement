import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OTPService } from "./otp.service";


const sendOTP = catchAsync(async (req: Request, res: Response) => {
    const { email, role } = req.body
    await OTPService.sendOTP(email, role)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP sent successfully",
        data: null,
    });
})

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    await OTPService.verifyOTP(email, otp)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP verified successfully",
        data: null,
    });
})
const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
    await OTPService.resetPassword(email, newPassword);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Password Update successfully",
        data: null,
    });
});

export const OTPController = {
    sendOTP,
    verifyOTP,
    resetPassword
};