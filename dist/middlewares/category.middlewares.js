"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryIdValidator = exports.categoryNameValidator = void 0;
const express_validator_1 = require("express-validator");
const mongodb_1 = require("mongodb");
const messages_1 = require("../constants/messages");
const database_services_1 = __importDefault(require("../services/database.services"));
const validations_1 = require("../utils/validations");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const error_middleware_1 = require("../middlewares/error.middleware");
exports.categoryNameValidator = (0, validations_1.validate)((0, express_validator_1.checkSchema)({
    name: {
        notEmpty: {
            errorMessage: messages_1.CATEGORY_MESSAGES.NAME_IS_REQUIRED
        },
        trim: true,
        isString: {
            errorMessage: messages_1.CATEGORY_MESSAGES.NAME_MUST_BE_A_STRING
        },
        isLength: {
            options: {
                min: 1,
                max: 100
            },
            errorMessage: messages_1.CATEGORY_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
        },
        custom: {
            options: async (value, { req }) => {
                const cateInDB = await database_services_1.default.categories.findOne({ name: value });
                if (cateInDB) {
                    throw Error(messages_1.CATEGORY_MESSAGES.CATEGORY_IS_EXIST);
                }
                return true;
            }
        }
    }
}, ['body']));
exports.categoryIdValidator = (0, validations_1.validate)((0, express_validator_1.checkSchema)({
    category_id: {
        custom: {
            options: async (value, { req }) => {
                if (!mongodb_1.ObjectId.isValid(value)) {
                    throw new error_middleware_1.ErrorWithStatus({
                        message: messages_1.CATEGORY_MESSAGES.INVALID_CATEGORY_ID,
                        status: httpStatus_1.default.BAD_REQUEST
                    });
                }
                const cateInDB = await database_services_1.default.categories.findOne({ _id: new mongodb_1.ObjectId(value) });
                if (!cateInDB) {
                    throw new error_middleware_1.ErrorWithStatus({
                        message: messages_1.CATEGORY_MESSAGES.CATEGORY_NOT_FOUND,
                        status: httpStatus_1.default.NOT_FOUND
                    });
                }
                return true;
            }
        }
    }
}, ['params']));
