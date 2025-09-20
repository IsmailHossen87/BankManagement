"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorHandlare_1 = require("./app/middleware/globalErrorHandlare");
const notFound_1 = require("./app/middleware/notFound");
const indes_1 = require("./app/routes/indes");
require("./app/config/passport");
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const env_1 = require("./app/config/env");
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: env_1.envVar.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://bank-menagement-backend.vercel.app"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_parser_1.default)());
app.use("/api/v1", indes_1.router);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome BankManagement System Backend"
    });
});
app.use(globalErrorHandlare_1.globalErrorHandler);
app.use(notFound_1.notFound);
exports.default = app;
