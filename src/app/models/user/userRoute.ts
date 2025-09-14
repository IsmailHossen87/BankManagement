import { Router } from "express";
import { UserControllers } from "./user.controler";
// import { checkAuth } from "../../middleware/checkAuth";
// import { IRole } from "./user.interface";

const router = Router()


router.post("/register", UserControllers.createUser)
// router.patch("/:id", checkAuth(...Object.values(IRole)), UserControllers.updateUser)

export const UserRoutes = router