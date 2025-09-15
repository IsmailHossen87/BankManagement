import { Router } from "express";
import { authController } from "./authControler";
import { checkAuth } from "../../middleware/checkAuth";
import { IRole } from "../user/user.interface";



const router = Router()


router.post("/login", authController.credentialLogin)
router.post("/refresh-token", authController.getNewAccessToken)
router.post("/logout", authController.logout)
router.post("/change-password", checkAuth(...Object.values(IRole)), authController.changePassword)

router.post("/forgot-password", authController.forgotPassword)


export const authRoute = router