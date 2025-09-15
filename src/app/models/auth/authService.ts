/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken"
import AppError from "../../errorHelper/AppError";
import { envVar } from "../../config/env";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userToken";
import jwt from "jsonwebtoken"
import { sendEmail } from "../../utils/sendEmail";


// 🔄 Get a new access token using a valid refresh token
const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
    return {
        accessToken: newAccessToken
    }
}

// 🔐 Change Password: Requires old password and new password
const changePassword = async (oldPassword: string, newPassword: string, docodedToken: JwtPayload) => {
    const user = await User.findById(docodedToken.userId);
    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string);
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password doed not match");
    }

    // 🔄 Hash and update the new password
    user!.password = await bcryptjs.hash(newPassword, Number(envVar.BCRYPT_SALT_ROUND));
    user!.save();
}





// 🔁 Reset Password from a reset link (token based)
const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
   if (payload.id != decodedToken.userId) {
      throw new AppError(401, "You can not reset your password");
   }

   const isUserExist = await User.findById(decodedToken.userId);
   if (!isUserExist) {
      throw new AppError(401, "User does not exist");
   }

   // 🔄 Hash and set new password
   const hashedPassword = await bcryptjs.hash(payload.newPassword, Number(envVar.BCRYPT_SALT_ROUND));
   isUserExist.password = hashedPassword;
   await isUserExist.save();
}

// forgetPassword
const forgotPassword = async (email: string) => {
    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const resetToken = jwt.sign(jwtPayload, envVar.JWT_ACCESS_SECRET, {
        expiresIn: "10m"
    })

    const resetUILink = `${envVar.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

    sendEmail({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "otp",
        templateData: {
            name: isUserExist.role,
            resetUILink
        }
    })
}



// 🔄 Export all Auth-related services
export const AuthService = {
    getNewAccessToken,
    changePassword,
    resetPassword,
    forgotPassword
};