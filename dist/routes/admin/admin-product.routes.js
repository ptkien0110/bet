"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../../controllers/product.controller");
const handler_1 = require("./../../utils/handler");
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const product_middlewares_1 = require("../../middlewares/product.middlewares");
const common_middleware_1 = require("../../middlewares/common.middleware");
const adminProductRouter = (0, express_1.Router)();
adminProductRouter.post('/', cloudinary_1.default.array('images', 4), (0, handler_1.wrapRequestHandler)(product_controller_1.createProductController));
adminProductRouter.get('/', product_middlewares_1.paginationValidator, (0, handler_1.wrapRequestHandler)(product_controller_1.getProductsController));
adminProductRouter.get('/:product_id', product_middlewares_1.productIdValidator, (0, handler_1.wrapRequestHandler)(product_controller_1.getProductController));
adminProductRouter.put('/:product_id', product_middlewares_1.productValidator, (0, common_middleware_1.filterMiddleware)([
    'name',
    'description',
    'category',
    'price_for_customer',
    'price_for_seller',
    'stock',
    'point',
    'profit',
    'discount'
]), (0, handler_1.wrapRequestHandler)(product_controller_1.updateProductController));
adminProductRouter.delete('/delete/:product_id', product_middlewares_1.productIdValidator, (0, handler_1.wrapRequestHandler)(product_controller_1.deleteProductController));
adminProductRouter.delete('/delete/:product_id/images/:public_id', product_middlewares_1.productIdValidator, (0, handler_1.wrapRequestHandler)(product_controller_1.deleteProductImageController));
adminProductRouter.post('/:product_id/images', cloudinary_1.default.array('images'), (0, handler_1.wrapRequestHandler)(product_controller_1.uploadProductImagesController));
exports.default = adminProductRouter;
