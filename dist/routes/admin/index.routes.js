"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_category_routes_1 = __importDefault(require("../../routes/admin/admin-category.routes"));
const admin_product_routes_1 = __importDefault(require("../../routes/admin/admin-product.routes"));
const adminRoutes = {
    prefix: '/admin/',
    routes: [
        {
            path: 'categories',
            route: admin_category_routes_1.default
        },
        {
            path: 'products',
            route: admin_product_routes_1.default
        }
    ]
};
exports.default = adminRoutes;
