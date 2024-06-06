"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = exports.refreshTokenController = exports.loginController = exports.registerController = void 0;
const auth_services_1 = __importDefault(require("../services/auth.services"));
const messages_1 = require("../constants/messages");
const registerController = async (req, res) => {
    const data = await auth_services_1.default.register(req.body);
    return res.json({
        message: messages_1.USERS_MESSAGES.REGISTER_SUCCESS,
        data
    });
};
exports.registerController = registerController;
const loginController = async (req, res) => {
    const user = req.user;
    const user_id = user._id;
    const data = await auth_services_1.default.login({
        user_id: user_id.toString(),
        roles: user.roles,
        verify: user.verify
    });
    await res.cookie('refresh_token', data.refresh_token, { httpOnly: true });
    return res.json({
        message: messages_1.USERS_MESSAGES.LOGIN_SUCCESS,
        data: {
            access_token: data.access_token
        }
    });
};
exports.loginController = loginController;
const refreshTokenController = async (req, res) => {
    const { refresh_token } = req.cookies;
    const { user_id, exp, roles, verify } = req.decoded_refresh_token;
    const data = await auth_services_1.default.refreshToken({ refresh_token, user_id, exp, roles, verify });
    await res.cookie('refresh_token', data.refresh_token, { httpOnly: true });
    return res.json({
        message: messages_1.USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
        data: {
            access_token: data.access_token
        }
    });
};
exports.refreshTokenController = refreshTokenController;
const logoutController = async (req, res) => {
    const { refresh_token } = req.body;
    const result = await auth_services_1.default.logout(refresh_token);
    return res.json(result);
};
exports.logoutController = logoutController;
