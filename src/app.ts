import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express"
import { globalErrorHandler } from "./app/middleware/globalErrorHandlare"
import { notFound } from "./app/middleware/notFound"
import { router } from "./app/routes/indes"
import "./app/config/passport"
import expressSession  from "express-session";
import passport from "passport";
import { envVar } from "./app/config/env";


const app = express() 

app.use(expressSession({
    secret: envVar.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(cors({
    origin: ["http://localhost:5173","https://bank-menagement-backend.vercel.app"],
    credentials: true, 
}))
app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser())
app.use("/api/v1", router)



app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome BankManagement System Backend"
    })
})
app.use(globalErrorHandler)
app.use(notFound)
export default app;