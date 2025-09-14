import mongoose from "mongoose";
import { TErrorSources, TGenericResponse } from "../interface/error.type";


export 
const handleValidationError = (err: mongoose.Error.ValidationError): TGenericResponse => {
    const errorSources: TErrorSources[] = [];
    const errors = Object.values(err.errors);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors.forEach((errorObject: any) =>
        errorSources.push({
            path: errorObject.path,
            message: errorObject.message,
        })
    );

    return {
        statusCode: 400,
        message: "Mongoose validation error",
        errorSources,
    };
};