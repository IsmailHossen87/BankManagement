"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRoutes = void 0;
const express_1 = __importDefault(require("express"));
const otp_conroller_1 = require("./otp.conroller");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
router.post("/send", otp_conroller_1.OTPController.sendOTP);
router.post("/verify", otp_conroller_1.OTPController.verifyOTP);
router.post("/reset-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.IRole)), otp_conroller_1.OTPController.resetPassword);
exports.OtpRoutes = router;
