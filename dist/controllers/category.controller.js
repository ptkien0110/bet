"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryController = exports.updateCategoryController = exports.getCategoryController = exports.getCategoriesController = exports.createCategoryController = void 0;
const messages_1 = require("../constants/messages");
const category_services_1 = __importDefault(require("../services/category.services"));
const createCategoryController = async (req, res, next) => {
    const { name } = req.body;
    const data = await category_services_1.default.createCategory(name);
    return res.json({
        message: messages_1.CATEGORY_MESSAGES.ADD_CATEGORY_SUCCESS,
        data
    });
};
exports.createCategoryController = createCategoryController;
const getCategoriesController = async (req, res, next) => {
    const data = await category_services_1.default.getCategories();
    return res.json({
        message: messages_1.CATEGORY_MESSAGES.GET_CATEGORIES_SUCCESS,
        data
    });
};
exports.getCategoriesController = getCategoriesController;
const getCategoryController = async (req, res, next) => {
    const { category_id } = req.params;
    const data = await category_services_1.default.getCategory(category_id);
    return res.json({
        message: messages_1.CATEGORY_MESSAGES.GET_CATEGORY_SUCCESS,
        data
    });
};
exports.getCategoryController = getCategoryController;
const updateCategoryController = async (req, res, next) => {
    const { category_id } = req.params;
    const { name } = req.body;
    const result = await category_services_1.default.updateCategory(category_id, name);
    return res.json({
        message: messages_1.CATEGORY_MESSAGES.UPDATE_CATEGORY_SUCCESS,
        result: result
    });
};
exports.updateCategoryController = updateCategoryController;
const deleteCategoryController = async (req, res, next) => {
    const { category_id } = req.params;
    const data = await category_services_1.default.deleteCategory(category_id);
    return res.json({
        message: messages_1.CATEGORY_MESSAGES.DELETE_CATEGORY_SUCCESS,
        data
    });
};
exports.deleteCategoryController = deleteCategoryController;
