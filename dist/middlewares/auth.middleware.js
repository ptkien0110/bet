"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifiedAdminValidator = exports.accessTokenValidator = exports.refreshTokenValidator = exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = require("jsonwebtoken");
const lodash_1 = require("lodash");
const common_1 = require("../constants/common");
const enum_1 = require("../constants/enum");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const messages_1 = require("../constants/messages");
const regex_1 = require("../constants/regex");
const error_middleware_1 = require("../middlewares/error.middleware");
const auth_services_1 = __importDefault(require("../services/auth.services"));
const database_services_1 = __importDefault(require("../services/database.services"));
const crypto_1 = require("../utils/crypto");
const jwt_1 = require("../utils/jwt");
const validations_1 = require("../utils/validations");
exports.registerValidator = (0, validations_1.validate)((0, express_validator_1.checkSchema)({
    name: {
        notEmpty: {
            errorMessage: messages_1.USERS_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
            errorMessage: messages_1.USERS_MESSAGES.NAME_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
            options: {
                min: 1,
                max: 100
            },
            errorMessage: messages_1.USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
        }
    },
    phone: {
        trim: true,
        custom: {
            options: async (value, { req }) => {
                if (!regex_1.REGEX_PHONE_NUMBER.test(value)) {
                    throw new Error(messages_1.USERS_MESSAGES.PHONE_NUMBER_INVALID);
                }
                const user = await database_services_1.default.users.findOne({ phone: value });
                if (user) {
                    throw Error(messages_1.USERS_MESSAGES.PHONE_NUMBER_EXISTED);
                }
                return true;
            }
        }
    },
    email: {
        isEmail: {
            errorMessage: messages_1.USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
            options: async (value) => {
                const isExistEmail = await auth_services_1.default.checkEmailExist(value);
                if (isExistEmail) {
                    throw new Error(messages_1.USERS_MESSAGES.EMAIL_ALREADY_EXISTS);
                }
                return true;
            }
        }
    },
    date_of_birth: {
        custom: {
            options: (value) => {
                const dateOfBirth = new Date(value);
                if (isNaN(dateOfBirth.getTime())) {
                    throw new Error('Invalid date_of_birth');
                }
                return true;
            }
        }
    },
    address: {
        notEmpty: {
            errorMessage: messages_1.USERS_MESSAGES.ADDRESS_IS_REQUIRED
        },
        isString: {
            errorMessage: messages_1.USERS_MESSAGES.ADDRESS_INVALID
        },
        trim: true,
        isLength: {
            options: {
                min: 1,
                max: 255
            },
            errorMessage: messages_1.USERS_MESSAGES.ADDRESS_LENGTH_MUST_BE_FROM_1_255
        }
    },
    password: {
        notEmpty: {
            errorMessage: messages_1.USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
            errorMessage: messages_1.USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
            options: {
                min: 6,
                max: 50
            },
            errorMessage: messages_1.USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
        },
        isStrongPassword: {
            options: {
                minLength: 6,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            },
            errorMessage: messages_1.USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
        }
    },
    confirm_password: {
        notEmpty: {
            errorMessage: messages_1.USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
        },
        isString: {
            errorMessage: messages_1.USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
            options: {
                min: 6,
                max: 50
            },
            errorMessage: messages_1.USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
        },
        custom: {
            options: (value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error(messages_1.USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD);
                }
                return true;
            }
        }
    }
}, ['body']));
exports.loginValidator = (0, validations_1.validate)((0, express_validator_1.checkSchema)({
    email: {
        isEmail: {
            errorMessage: messages_1.USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
            options: async (value, { req }) => {
                const user = await database_services_1.default.users.findOne({
                    email: value,
                    password: (0, crypto_1.hashPassword)(req.body.password)
                });
                if (user == null) {
                    throw new Error(messages_1.USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT);
                }
                req.user = user;
                return true;
            }
        }
    },
    password: {
        notEmpty: {
            errorMessage: messages_1.USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
            errorMessage: messages_1.USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
            options: {
                min: 6,
                max: 50
            },
            errorMessage: messages_1.USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
        },
        isStrongPassword: {
            options: {
                minLength: 6,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            },
            errorMessage: messages_1.USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
        }
    }
}, ['body']));
exports.refreshTokenValidator = (0, validations_1.validate)((0, express_validator_1.checkSchema)({
    refresh_token: {
        trim: true,
        custom: {
            options: async (value, { req }) => {
                if (!value) {
                    throw new error_middleware_1.ErrorWithStatus({
                        message: messages_1.USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
                        status: httpStatus_1.default.UNAUTHORIZED
                    });
                }
                try {
                    const [decoded_refresh_token, refresh_token] = await Promise.all([
                        (0, jwt_1.verifyToken)({
                            token: value,
                            secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN
                        }),
                        database_services_1.default.refreshTokens.findOne({ token: value })
                    ]);
                    if (refresh_token === null) {
                        throw new error_middleware_1.ErrorWithStatus({
                            message: messages_1.USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                            status: httpStatus_1.default.UNAUTHORIZED
                        });
                    }
                    ;
                    req.decoded_refresh_token = decoded_refresh_token;
                }
                catch (error) {
                    if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                        throw new error_middleware_1.ErrorWithStatus({
                            message: (0, lodash_1.capitalize)(error.message),
                            status: httpStatus_1.default.UNAUTHORIZED
                        });
                    }
                    throw error;
                }
                return true;
            }
        }
    }
}));
exports.accessTokenValidator = (0, validations_1.validate)((0, express_validator_1.checkSchema)({
    Authorization: {
        custom: {
            options: async (value, { req }) => {
                const access_token = (value || '').split(' ')[1];
                return await (0, common_1.verifyAccessToken)(access_token, req);
            }
        }
    }
}, ['headers']));
const verifiedAdminValidator = async (req, res, next) => {
    const { roles } = req.decoded_authorization;
    if (roles !== enum_1.ROLE.ADMIN) {
        return next(new error_middleware_1.ErrorWithStatus({
            message: messages_1.USERS_MESSAGES.ACCOUNT_NOT_ADMIN,
            status: httpStatus_1.default.FORBIDDEN
        }));
    }
    next();
};
exports.verifiedAdminValidator = verifiedAdminValidator;
