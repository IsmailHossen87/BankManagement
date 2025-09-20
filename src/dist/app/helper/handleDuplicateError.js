"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err) => {
    const match = err.message.match(/"([^"]*)"/);
    return {
        statusCode: 400,
        message: match ? `${match[1]} already exists` : "Duplicate field value entered",
    };
};
exports.handleDuplicateError = handleDuplicateError;
