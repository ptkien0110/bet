"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_auth_routes_1 = __importDefault(require("../../routes/common/common-auth.routes"));
const commonRoutes = {
    prefix: '/',
    routes: [
        {
            path: 'auth',
            route: common_auth_routes_1.default
        }
    ]
};
exports.default = commonRoutes;
