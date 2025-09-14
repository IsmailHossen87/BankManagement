import { TGenericResponse } from "../interface/error.type";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDuplicateError = (err: any): TGenericResponse => {
    const match = err.message.match(/"([^"]*)"/);
    return {
        statusCode: 400,
        message: match ? `${match[1]} already exists` : "Duplicate field value entered",
    };
};