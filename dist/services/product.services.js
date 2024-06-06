"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const messages_1 = require("../constants/messages");
const error_middleware_1 = require("../middlewares/error.middleware");
const Product_schema_1 = __importDefault(require("../models/schemas/Product.schema"));
const database_services_1 = __importDefault(require("../services/database.services"));
const cloudinary_1 = require("cloudinary");
const enum_1 = require("../constants/enum");
class ProductService {
    async createProduct({ body, fileData }) {
        const categoryId = body.category;
        const category = await database_services_1.default.categories.findOne({ _id: new mongodb_1.ObjectId(categoryId) });
        if (!category) {
            const publicIds = fileData.map((file) => file.filename);
            await cloudinary_1.v2.api.delete_resources(publicIds);
            throw new error_middleware_1.ErrorWithStatus({
                status: httpStatus_1.default.UNPROCESSABLE_ENTITY,
                message: messages_1.CATEGORY_MESSAGES.CATEGORY_NOT_FOUND
            });
        }
        console.log(fileData);
        const product = await database_services_1.default.products.insertOne(new Product_schema_1.default({
            name: body.name,
            images: fileData.map((item) => ({ path: item.path, filename: item.filename })),
            description: body.description,
            category: new mongodb_1.ObjectId(categoryId),
            price_for_customer: Number(body.price_for_customer),
            price_for_seller: Number(body.price_for_seller),
            stock: Number(body.stock),
            point: Number(body.point),
            profit: Number(body.profit),
            discount: Number(body.discount)
        }));
        const data = await database_services_1.default.products
            .aggregate([
            {
                $match: {
                    _id: new mongodb_1.ObjectId(product.insertedId)
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            }
        ])
            .toArray();
        return data[0];
    }
    async getProducts({ limit, page }) {
        const products = await database_services_1.default.products
            .aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            },
            {
                $skip: limit * (page - 1)
            },
            {
                $limit: limit
            }
        ])
            .toArray();
        const total = await database_services_1.default.products.countDocuments({});
        return {
            products,
            total
        };
    }
    async getProduct(product_id) {
        const product = await database_services_1.default.products
            .aggregate([
            {
                $match: {
                    _id: new mongodb_1.ObjectId(product_id)
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            }
        ])
            .toArray();
        return product[0];
    }
    async updateProduct(product_id, payload) {
        const updatePayload = {
            ...payload,
            ...(payload.category && { category: new mongodb_1.ObjectId(payload.category) })
        };
        const product = await database_services_1.default.products.findOneAndUpdate({
            _id: new mongodb_1.ObjectId(product_id)
        }, {
            $set: updatePayload,
            $currentDate: {
                updated_at: true
            }
        }, {
            returnDocument: 'after'
        });
        const data = await database_services_1.default.products
            .aggregate([
            {
                $match: {
                    _id: new mongodb_1.ObjectId(product_id)
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: {
                    path: '$category',
                    preserveNullAndEmptyArrays: true
                }
            }
        ])
            .toArray();
        return data[0];
    }
    async deleteProduct(product_id) {
        const product = await database_services_1.default.products.findOneAndUpdate({ _id: new mongodb_1.ObjectId(product_id) }, {
            $set: {
                destroy: enum_1.ProductStatus.Hidden
            }
        }, {
            returnDocument: 'after'
        });
        const data = await database_services_1.default.products
            .aggregate([
            {
                $match: {
                    _id: new mongodb_1.ObjectId(product_id)
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: {
                    path: '$category',
                    preserveNullAndEmptyArrays: true
                }
            }
        ])
            .toArray();
        return data[0];
    }
    async deleteImageProduct(product_id, public_id) {
        const product = await database_services_1.default.products.findOne({ _id: new mongodb_1.ObjectId(product_id) });
        if (!product) {
            throw Error('Product not found');
        }
        if (!product.images || product.images.length === 0) {
            throw Error('Product has no images');
        }
        const imageIndex = product.images.findIndex((image) => image.split('/').pop()?.split('.')[0] === public_id);
        if (imageIndex === -1) {
            throw Error('Image not found');
        }
        const publicId = product.images[imageIndex].split('/').pop()?.split('.')[0];
        await cloudinary_1.v2.api.delete_resources([publicId]);
        product.images.splice(imageIndex, 1);
        await database_services_1.default.products.updateOne({ _id: new mongodb_1.ObjectId(product_id) }, { $set: { images: product.images } });
        const data = await database_services_1.default.products
            .aggregate([
            {
                $match: {
                    _id: new mongodb_1.ObjectId(product_id)
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: {
                    path: '$category',
                    preserveNullAndEmptyArrays: true
                }
            }
        ])
            .toArray();
        return data[0];
    }
    async uploadImageProduct(product_id, imageFiles) {
        const MAX_IMAGE_COUNT = 4;
        const product = await database_services_1.default.products.findOne({ _id: new mongodb_1.ObjectId(product_id) });
        if (!product) {
            throw new Error('Product not found');
        }
        const currentImageCount = product.images ? product.images.length : 0;
        if (currentImageCount + imageFiles.length > MAX_IMAGE_COUNT) {
            throw new Error(`Số lượng ảnh không được vượt quá ${MAX_IMAGE_COUNT}`);
        }
        await database_services_1.default.products.updateOne({ _id: new mongodb_1.ObjectId(product_id) }, { $push: { images: { $each: imageFiles.map((item) => item.path) } } });
        const data = await database_services_1.default.products
            .aggregate([
            {
                $match: {
                    _id: new mongodb_1.ObjectId(product_id)
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: {
                    path: '$category',
                    preserveNullAndEmptyArrays: true
                }
            }
        ])
            .toArray();
        return data[0];
    }
}
const productService = new ProductService();
exports.default = productService;
