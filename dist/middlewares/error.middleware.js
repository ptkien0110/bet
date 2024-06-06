"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultErrorHandler = exports.EntityError = exports.ErrorWithStatus = void 0;
const lodash_1 = require("lodash");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const messages_1 = require("../constants/messages");
class ErrorWithStatus {
    message;
    status;
    constructor({ message, status }) {
        this.message = message;
        this.status = status;
    }
}
exports.ErrorWithStatus = ErrorWithStatus;
class EntityError extends ErrorWithStatus {
    errors;
    constructor({ message = messages_1.USERS_MESSAGES.VALIDATION_ERROR, errors }) {
        super({ message, status: httpStatus_1.default.UNPROCESSABLE_ENTITY });
        this.errors = errors;
    }
}
exports.EntityError = EntityError;
const defaultErrorHandler = (err, req, res, next) => {
    try {
        if (err instanceof ErrorWithStatus) {
            return res.status(err.status).json((0, lodash_1.omit)(err, ['status']));
        }
        const finalError = {};
        Object.getOwnPropertyNames(err).forEach((key) => {
            if (!Object.getOwnPropertyDescriptor(err, key)?.configurable ||
                !Object.getOwnPropertyDescriptor(err, key)?.writable) {
                return;
            }
            finalError[key] = err[key];
        });
        res.status(httpStatus_1.default.INTERNAL_SERVER_ERROR).json({
            message: finalError.message,
            errorInfo: (0, lodash_1.omit)(finalError, ['stack'])
        });
    }
    catch (error) {
        res.status(httpStatus_1.default.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error',
            errorInfo: (0, lodash_1.omit)(error, ['stack'])
        });
    }
};
exports.defaultErrorHandler = defaultErrorHandler;
