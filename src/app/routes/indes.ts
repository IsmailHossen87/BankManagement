import { Router } from "express"
import { UserRoutes } from "../models/user/userRoute"
import { authRoute } from "../models/auth/authRoute"
import { PersonalRouter } from "../models/PersonalInfo/personalInfo.router"
import { OtpRoutes } from "../models/otp/otp.route"


export const router = Router()

const moduleRoutes = [
    { path: "/user", route: UserRoutes },
    { path: "/auth", route: authRoute },
    { path: "/info", route: PersonalRouter },
    { path: "/otp", route: OtpRoutes },
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})