import { Router } from "express";
import { personalInfoControllers } from "./personalInfo.controler";
import { checkAuth } from "../../middleware/checkAuth";
import { IRole } from "../user/user.interface";


const router = Router()

router.post("/",checkAuth(...Object.values(IRole)),personalInfoControllers.createInformation)
router.get("/getMe",checkAuth(...Object.values(IRole)),personalInfoControllers.getSingleInformation)
// admin see it 
router.get("/getAll",checkAuth((IRole.ADMIN)),personalInfoControllers.getAllInformation)
router.patch("/status-change/:id",checkAuth((IRole.ADMIN)),personalInfoControllers.changeStatus)

router.patch("/loan-request",checkAuth(...Object.values(IRole)),personalInfoControllers.loanRequest)

router.patch("/updateInfo",checkAuth(...Object.values(IRole)),personalInfoControllers.updateInformaiton)


export const PersonalRouter = router