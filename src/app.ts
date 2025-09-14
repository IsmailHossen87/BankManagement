import cookieParser from "cookie-parser";
import express, { Request, Response } from "express"
import { globalErrorHandler } from "./app/middleware/globalErrorHandlare"
import { notFound } from "./app/middleware/notFound"
import { router } from "./app/routes/indes"
import "./app/config/passport"
import cors from "cors";
import expressSession  from "express-session";
import passport from "passport";
import { envVar } from "./app/config/env";


const app = express() 

app.use(expressSession({
    secret: envVar.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser())
app.use("/api/v1", router)
app.use(cors())


app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome BankManagement System Backend"
    })
})
app.use(globalErrorHandler)
app.use(notFound)
export default app;