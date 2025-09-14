/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

import { handleDuplicateError } from "../helper/handleDuplicateError";
import { handleCastError } from "../helper/handle.castError";
import { handleZodError } from "../helper/handle.zoderror";
import { handleValidationError } from "../helper/handleValidateError";
import { TErrorSources } from "../interface/error.type";
import { envVar } from "../config/env";
import AppError from "../errorHelper/AppError";





// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = async( err: any,req: Request, res: Response,next: NextFunction) => { 
    if(envVar.NODE_ENV === "development"){
        console.log(err)
    }

    let statusCode = 500;
    let message = "Something went wrong!";
    let errorSources: TErrorSources[] = [];



    if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
         // It has no Source
    } else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        // It has no Source
    } else if (err.name === "ZodError") {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources || [];
    } else if (err.name === "ValidationError") {
        const simplifiedError = handleValidationError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources || [];
    } else if (err instanceof AppError) {
        message = err.message;
        statusCode = err.statusCode;
    } else if (err instanceof Error) {
        message = err.message;
        statusCode = 500;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err :envVar.NODE_ENV === "development" ? err : null,
        stack: envVar.NODE_ENV === "development" ? err.stack : null,
    });
};