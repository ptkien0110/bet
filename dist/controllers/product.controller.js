"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProductImagesController = exports.deleteProductImageController = exports.deleteProductController = exports.updateProductController = exports.getProductController = exports.getProductsController = exports.createProductController = void 0;
const messages_1 = require("../constants/messages");
const product_services_1 = __importDefault(require("../services/product.services"));
const createProductController = async (req, res, next) => {
    const fileData = req.files;
    const body = req.body;
    const data = await product_services_1.default.createProduct({ body, fileData });
    return res.json({
        message: messages_1.PRODUCT_MESSAGES.CREATE_PRODUCT_SUCCESS,
        data
    });
};
exports.createProductController = createProductController;
const getProductsController = async (req, res) => {
    const limit = Number(req.query.limit);
    const page = Number(req.query.page);
    const data = await product_services_1.default.getProducts({ limit, page });
    return res.json({
        message: messages_1.PRODUCT_MESSAGES.CREATE_PRODUCT_SUCCESS,
        data: {
            products: data.products,
            limit,
            page,
            total_page: Math.ceil(data.total / limit)
        }
    });
};
exports.getProductsController = getProductsController;
const getProductController = async (req, res) => {
    const { product_id } = req.params;
    const data = await product_services_1.default.getProduct(product_id);
    return res.json({
        message: messages_1.PRODUCT_MESSAGES.GET_PRODUCT_SUCCESS,
        data
    });
};
exports.getProductController = getProductController;
const updateProductController = async (req, res) => {
    const { product_id } = req.params;
    const payload = req.body;
    const data = await product_services_1.default.updateProduct(product_id, payload);
    return res.json({
        message: messages_1.PRODUCT_MESSAGES.UPDATE_PRODUCT_SUCCESS,
        data
    });
};
exports.updateProductController = updateProductController;
const deleteProductController = async (req, res) => {
    const { product_id } = req.params;
    const data = await product_services_1.default.deleteProduct(product_id);
    return res.json({
        message: messages_1.PRODUCT_MESSAGES.DELETE_PRODUCT_SUCCESS,
        data
    });
};
exports.deleteProductController = deleteProductController;
const deleteProductImageController = async (req, res) => {
    const { product_id, public_id } = req.params;
    const data = await product_services_1.default.deleteImageProduct(product_id, public_id);
    return res.json({
        message: messages_1.PRODUCT_MESSAGES.DELETE_PRODUCT_SUCCESS,
        data
    });
};
exports.deleteProductImageController = deleteProductImageController;
const uploadProductImagesController = async (req, res) => {
    const imageFiles = req.files;
    const { product_id } = req.params;
    const data = await product_services_1.default.uploadImageProduct(product_id, imageFiles);
    return res.json({
        message: messages_1.PRODUCT_MESSAGES.DELETE_PRODUCT_SUCCESS,
        data
    });
};
exports.uploadProductImagesController = uploadProductImagesController;
