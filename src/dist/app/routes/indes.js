"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const userRoute_1 = require("../models/user/userRoute");
const authRoute_1 = require("../models/auth/authRoute");
const personalInfo_router_1 = require("../models/PersonalInfo/personalInfo.router");
const otp_route_1 = require("../models/otp/otp.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    { path: "/user", route: userRoute_1.UserRoutes },
    { path: "/auth", route: authRoute_1.authRoute },
    { path: "/info", route: personalInfo_router_1.PersonalRouter },
    { path: "/otp", route: otp_route_1.OtpRoutes },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
