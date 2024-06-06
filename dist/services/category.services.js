"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const database_services_1 = __importDefault(require("./database.services"));
const Category_schema_1 = __importDefault(require("../models/schemas/Category.schema"));
const enum_1 = require("../constants/enum");
class CategoryService {
    async createCategory(name) {
        const result = await database_services_1.default.categories.insertOne(new Category_schema_1.default({
            name
        }));
        const cate = await database_services_1.default.categories.findOne({ _id: result.insertedId });
        return cate;
    }
    async getCategories() {
        const categories = await database_services_1.default.categories.find({}).toArray();
        return categories;
    }
    async getCategory(category_id) {
        const category = await database_services_1.default.categories
            .find({
            _id: new mongodb_1.ObjectId(category_id)
        })
            .toArray();
        return category[0];
    }
    async updateCategory(category_id, new_name) {
        const category = await database_services_1.default.categories.findOneAndUpdate({ _id: new mongodb_1.ObjectId(category_id) }, { $set: { name: new_name } }, {
            upsert: true,
            returnDocument: 'after'
        });
        return category;
    }
    async deleteCategory(category_id) {
        const result = await database_services_1.default.categories.findOneAndUpdate({ _id: new mongodb_1.ObjectId(category_id) }, { $set: { status: enum_1.CategoryStatus.Hidden } }, { returnDocument: 'after' });
        console.log(result);
        return result;
    }
}
const categoryService = new CategoryService();
exports.default = categoryService;
