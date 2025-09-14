import { Router } from "express";
import { authController } from "./authControler";
import { checkAuth } from "../../middleware/checkAuth";
import { IRole } from "../user/user.interface";



const router = Router()


router.post("/login", authController.credentialLogin)
router.post("/refresh-token", authController.getNewAccessToken)
router.post("/logout", authController.logout)
router.post("/change-password", checkAuth(...Object.values(IRole)), authController.changePassword)

// router.post("/setpassword", checkAuth(...Object.values(IRole)), authController.setPassword)
// router.post("/forgot-password", authController.forgotPassword)
// router.post("/reset-password", checkAuth(...Object.values(IRole)), authController.resetPassword)

export const authRoute = router