"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../../controllers/category.controller");
const category_middlewares_1 = require("../../middlewares/category.middlewares");
const handler_1 = require("../../utils/handler");
const adminCategoryRouter = (0, express_1.Router)();
adminCategoryRouter.post('/', 
//accessTokenValidator,
//verifiedAdminValidator,
category_middlewares_1.categoryNameValidator, (0, handler_1.wrapRequestHandler)(category_controller_1.createCategoryController));
adminCategoryRouter.get('/', (0, handler_1.wrapRequestHandler)(category_controller_1.getCategoriesController));
adminCategoryRouter.get('/:category_id', 
//accessTokenValidator,
// verifiedAdminValidator,
category_middlewares_1.categoryIdValidator, (0, handler_1.wrapRequestHandler)(category_controller_1.getCategoryController));
adminCategoryRouter.put('/:category_id', 
// accessTokenValidator,
//verifiedAdminValidator,
category_middlewares_1.categoryNameValidator, category_middlewares_1.categoryIdValidator, (0, handler_1.wrapRequestHandler)(category_controller_1.updateCategoryController));
adminCategoryRouter.delete('/:category_id', 
// accessTokenValidator,
//verifiedAdminValidator,
category_middlewares_1.categoryIdValidator, (0, handler_1.wrapRequestHandler)(category_controller_1.deleteCategoryController));
exports.default = adminCategoryRouter;
