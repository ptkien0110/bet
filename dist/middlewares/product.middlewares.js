"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationValidator = exports.productIdValidator = exports.productValidator = void 0;
const express_validator_1 = require("express-validator");
const mongodb_1 = require("mongodb");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const messages_1 = require("../constants/messages");
const error_middleware_1 = require("../middlewares/error.middleware");
const database_services_1 = __importDefault(require("../services/database.services"));
const validations_1 = require("../utils/validations");
exports.productValidator = (0, validations_1.validate)((0, express_validator_1.checkSchema)({
    name: {
        optional: true,
        isString: {
            errorMessage: messages_1.PRODUCT_MESSAGES.NAME_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
            options: {
                min: 1,
                max: 100
            },
            errorMessage: messages_1.PRODUCT_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
        }
    },
    description: {
        optional: true,
        isString: {
            errorMessage: messages_1.PRODUCT_MESSAGES.NAME_MUST_BE_A_STRING
        },
        trim: true
    },
    category: {
        optional: true,
        custom: {
            options: async (value, { req }) => {
                if (!mongodb_1.ObjectId.isValid(new mongodb_1.ObjectId(value))) {
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
    },
    price_for_customer: {
        optional: true,
        isNumeric: {
            errorMessage: messages_1.PRODUCT_MESSAGES.PRICE_MUST_BE_A_NUMBER
        }
    },
    price_for_seller: {
        optional: true,
        isNumeric: {
            errorMessage: messages_1.PRODUCT_MESSAGES.PRICE_MUST_BE_A_NUMBER
        }
    },
    stock: {
        optional: true,
        isNumeric: {
            errorMessage: messages_1.PRODUCT_MESSAGES.STOCK_MUST_BE_A_NUMBER
        }
    },
    point: {
        optional: true,
        isNumeric: {
            errorMessage: messages_1.PRODUCT_MESSAGES.POINT_MUST_BE_A_NUMBER
        }
    },
    profit: {
        optional: true,
        isNumeric: {
            errorMessage: messages_1.PRODUCT_MESSAGES.PROFIT_MUST_BE_A_NUMBER
        }
    },
    discount: {
        optional: true,
        isNumeric: {
            errorMessage: messages_1.PRODUCT_MESSAGES.PROFIT_MUST_BE_A_NUMBER
        }
    }
}));
exports.productIdValidator = (0, validations_1.validate)((0, express_validator_1.checkSchema)({
    product_id: {
        notEmpty: {
            errorMessage: messages_1.PRODUCT_MESSAGES.INVALID_PRODUCT_ID
        },
        trim: true,
        custom: {
            options: async (value, { req }) => {
                if (!mongodb_1.ObjectId.isValid(value)) {
                    throw new error_middleware_1.ErrorWithStatus({
                        message: messages_1.PRODUCT_MESSAGES.INVALID_PRODUCT_ID,
                        status: httpStatus_1.default.NOT_FOUND
                    });
                }
                const productInDB = await database_services_1.default.products.findOne({ _id: new mongodb_1.ObjectId(value) });
                if (productInDB == null) {
                    throw new error_middleware_1.ErrorWithStatus({
                        message: messages_1.PRODUCT_MESSAGES.PRODUCT_NOT_FOUND,
                        status: httpStatus_1.default.NOT_FOUND
                    });
                }
                return true;
            }
        }
    }
}, ['params', 'body']));
exports.paginationValidator = (0, validations_1.validate)((0, express_validator_1.checkSchema)({
    limit: {
        isNumeric: true,
        custom: {
            options: async (value, { req }) => {
                const num = Number(value);
                if (num > 100 || num < 1) {
                    throw new Error('1 <= limit <= 100');
                }
                return true;
            }
        }
    },
    page: {
        isNumeric: true,
        custom: {
            options: async (value, { req }) => {
                const num = Number(value);
                if (num < 1) {
                    throw new Error('page >= 1');
                }
                return true;
            }
        }
    }
}));
