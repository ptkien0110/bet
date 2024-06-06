"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const enum_1 = require("../constants/enum");
const messages_1 = require("../constants/messages");
const RefreshToken_schema_1 = __importDefault(require("../models/schemas/RefreshToken.schema"));
const User_schema_1 = __importDefault(require("../models/schemas/User.schema"));
const database_services_1 = __importDefault(require("../services/database.services"));
const crypto_1 = require("../utils/crypto");
const jwt_1 = require("../utils/jwt");
class AuthService {
    signAccessToken({ user_id, verify, roles }) {
        return (0, jwt_1.signToken)({
            payload: {
                user_id,
                roles,
                token_type: enum_1.TokenType.AccessToken,
                verify
            },
            privateKey: process.env.JWT_SECRET_ACCESS_TOKEN,
            options: {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
            }
        });
    }
    signRefreshToken({ user_id, verify, exp, roles }) {
        if (exp) {
            return (0, jwt_1.signToken)({
                payload: {
                    user_id,
                    roles,
                    token_type: enum_1.TokenType.RefreshToken,
                    verify,
                    exp
                },
                privateKey: process.env.JWT_SECRET_REFRESH_TOKEN
            });
        }
        return (0, jwt_1.signToken)({
            payload: {
                user_id,
                token_type: enum_1.TokenType.RefreshToken,
                verify,
                roles
            },
            privateKey: process.env.JWT_SECRET_REFRESH_TOKEN,
            options: {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
            }
        });
    }
    decodeRefreshToken(refresh_token) {
        return (0, jwt_1.verifyToken)({
            token: refresh_token,
            secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN
        });
    }
    signAccessTokenAndRefreshToken({ user_id, verify, roles }) {
        return Promise.all([
            this.signAccessToken({ user_id, verify, roles }),
            this.signRefreshToken({ user_id, verify, roles })
        ]);
    }
    async checkEmailExist(email) {
        const user = await database_services_1.default.users.findOne({
            email
        });
        return Boolean(user);
    }
    async register(payload) {
        const user = await database_services_1.default.users.insertOne(new User_schema_1.default({
            ...payload,
            password: (0, crypto_1.hashPassword)(payload.password),
            roles: enum_1.ROLE.CUSTOMER,
            verify: enum_1.UserVerifyStatus.Unverified
        }));
        const result = await database_services_1.default.users.findOne({ _id: new mongodb_1.ObjectId(user.insertedId) });
        return result;
    }
    async login({ user_id, roles, verify }) {
        const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
            user_id,
            roles,
            verify
        });
        const { iat, exp } = await this.decodeRefreshToken(refresh_token);
        await database_services_1.default.refreshTokens.insertOne(new RefreshToken_schema_1.default({ user_id: new mongodb_1.ObjectId(user_id), token: refresh_token, iat, exp }));
        return {
            access_token,
            refresh_token
        };
    }
    async refreshToken({ user_id, verify, refresh_token, roles, exp }) {
        const [new_access_token, new_refresh_token] = await Promise.all([
            this.signAccessToken({ user_id, verify, roles }),
            this.signRefreshToken({ user_id, verify, exp, roles }),
            database_services_1.default.refreshTokens.deleteOne({ token: refresh_token })
        ]);
        const decoded_refresh_token = await this.decodeRefreshToken(new_refresh_token);
        await database_services_1.default.refreshTokens.insertOne(new RefreshToken_schema_1.default({
            user_id: new mongodb_1.ObjectId(user_id),
            token: new_refresh_token,
            iat: decoded_refresh_token.iat,
            exp: decoded_refresh_token.exp
        }));
        return {
            access_token: new_access_token,
            refresh_token: new_refresh_token
        };
    }
    async logout(refresh_token) {
        await database_services_1.default.refreshTokens.deleteOne({ token: refresh_token });
        return {
            message: messages_1.USERS_MESSAGES.LOGOUT_SUCCESS
        };
    }
}
const authService = new AuthService();
exports.default = authService;
