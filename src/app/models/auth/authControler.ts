/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import passport from "passport";
import AppError from "../../errorHelper/AppError";
import { createUserTokens } from "../../utils/userToken";
import { setAuthCookie } from "../../utils/setCookies";
import { AuthService } from "./authService";
import { JwtPayload } from "jsonwebtoken";


const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
        if (err) {
            return next(new AppError(401, err))
        } if (!user) {
            return next(new AppError(401, info.message))
        }
        const userTokens = await createUserTokens(user)

        const { password: pass, ...rest } = user.toObject()
        setAuthCookie(res, userTokens)
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest

            },
        })
    })(req, res, next)



})

// 🚪 Logout User: clear cookies
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged out successfully",
        data: null
    });
});
// 🔄 Get New Access Token from refresh token
const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refrestToken = req.cookies.refreshToken;
    if (!refrestToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token received from cookies");
    }

    const tokenInfo = await AuthService.getNewAccessToken(refrestToken);
    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrieved successfully",
        data: tokenInfo
    });
});

// 🔁 Change Password: old password required
const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const { newPassword, oldPassword } = req.body;

    await AuthService.changePassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password changed successfully",
        data: null
    });
});

// 🔁 Reset Password: through reset link
const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    await AuthService.resetPassword(req.body, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password changed successfully",
        data: null
    });
});


// 📧 Forgot Password: sends reset email link
const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    await AuthService.forgotPassword(email);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Reset email sent successfully",
        data: null
    });
});

export const authController = {
    credentialLogin, getNewAccessToken,
    logout,
    changePassword,
    resetPassword,
    forgotPassword 
}