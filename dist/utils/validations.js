"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const error_middleware_1 = require("../middlewares/error.middleware");
const validate = (validation) => {
    return async (req, res, next) => {
        await validation.run(req);
        const errors = (0, express_validator_1.validationResult)(req);
        //Nếu không có lỗi thì next
        if (errors.isEmpty()) {
            return next();
        }
        const errorsObject = errors.mapped();
        const entityError = new error_middleware_1.EntityError({ errors: {} });
        for (const key in errorsObject) {
            const { msg } = errorsObject[key];
            // Trả về lỗi không phải là lỗi do validate
            if (msg instanceof error_middleware_1.ErrorWithStatus && msg.status !== httpStatus_1.default.UNPROCESSABLE_ENTITY) {
                return next(msg);
            }
            entityError.errors[key] = errorsObject[key];
        }
        next(entityError);
    };
};
exports.validate = validate;
