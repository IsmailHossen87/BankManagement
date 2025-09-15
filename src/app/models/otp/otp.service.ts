import crypto from "crypto";
import bcryptjs from "bcryptjs";


import { sendEmail } from "../../utils/sendEmail";
import { User } from "../user/user.model";
import AppError from "../../errorHelper/AppError";
import { redisClient } from "../../config/redis.config";
const OTP_EXPIRATION = 2 * 60 // 2minute

const generateOtp = (length = 6) => {
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString()

    return otp
}

const sendOTP = async (email: string, name: string) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(404, "User not found")
    }

    const otp = generateOtp();

    const redisKey = `otp:${email}`

    await redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    })

    await sendEmail({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp
        }
    })
};


const verifyOTP = async (email: string, otp: string) => {
    // const user = await User.findOne({ email, isVerified: false })
    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(404, "User not found")
    }
    const redisKey = `otp:${email}`

    const savedOtp = await redisClient.get(redisKey)

    if (!savedOtp) {
        throw new AppError(401, "Invalid OTP");
    }

    if (savedOtp !== otp) {
        throw new AppError(401, "Invalid OTP");
    }


    await Promise.all([
        redisClient.set(`otp:${email}:verified`, "true", { expiration: { type: "EX", value: 300 } }), // 5 min
        redisClient.del([redisKey])
    ]);


};


const resetPassword = async (email: string, newPassword: string) => {
  const redisKey = `otp:${email}:verified`;
  const isVerified = await redisClient.get(redisKey);

  if (!isVerified) throw new AppError(401, "OTP not verified or expired");

  const hashedPassword = await bcryptjs.hash(newPassword, 10);

  const user = await User.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError(500, "Password update failed");
  }

  await redisClient.del(redisKey);
};



export const OTPService = {
    sendOTP,
    verifyOTP,
    resetPassword
}