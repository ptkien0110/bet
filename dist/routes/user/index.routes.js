"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_user_routes_1 = require("../../routes/user/user-user.routes");
const userRoutes = {
    prefix: '/',
    routes: [
        {
            path: 'user',
            route: user_user_routes_1.userUserRouter
        }
    ]
};
exports.default = userRoutes;
