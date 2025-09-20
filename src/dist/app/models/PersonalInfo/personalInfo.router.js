"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalRouter = void 0;
const express_1 = require("express");
const personalInfo_controler_1 = require("./personalInfo.controler");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.post("/", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.IRole)), personalInfo_controler_1.personalInfoControllers.createInformation);
router.get("/getMe", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.IRole)), personalInfo_controler_1.personalInfoControllers.getSingleInformation);
// admin see it 
router.get("/getAll", (0, checkAuth_1.checkAuth)((user_interface_1.IRole.ADMIN)), personalInfo_controler_1.personalInfoControllers.getAllInformation);
router.patch("/status-change/:id", (0, checkAuth_1.checkAuth)((user_interface_1.IRole.ADMIN)), personalInfo_controler_1.personalInfoControllers.changeStatus);
router.patch("/loan/:id", (0, checkAuth_1.checkAuth)((user_interface_1.IRole.ADMIN)), personalInfo_controler_1.personalInfoControllers.approvalDetails);
router.patch("/loan-request", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.IRole)), personalInfo_controler_1.personalInfoControllers.loanRequest);
router.patch("/updateInfo", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.IRole)), personalInfo_controler_1.personalInfoControllers.updateInformaiton);
exports.PersonalRouter = router;
