import express from "express";

import { OTPController } from "./otp.conroller";
import { checkAuth } from "../../middleware/checkAuth";
import { IRole } from "../user/user.interface";

const router = express.Router();

router.post("/send", OTPController.sendOTP);
router.post("/verify", OTPController.verifyOTP);
router.post("/reset-password", checkAuth(...Object.values(IRole)), OTPController.resetPassword)
export const OtpRoutes = router;
