import mongoose from "mongoose";
import { TGenericResponse } from "../interface/error.type";

        
export 
const handleCastError = (err: mongoose.Error.CastError): TGenericResponse => {
    return {
        statusCode: 400,
        message: "Invalid MongoDB objectID. Please provide a valid id",
    };
};