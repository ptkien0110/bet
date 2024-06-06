"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("../../constants/enum");
class Product {
    _id;
    name;
    images;
    description;
    category;
    price_for_customer;
    price_for_seller;
    stock;
    sold;
    view;
    point;
    profit;
    discount;
    destroy;
    created_at;
    updated_at;
    constructor(product) {
        this._id = product._id;
        this.name = product.name || '';
        this.images = product.images || [];
        this.description = product.description || '';
        this.category = product.category;
        this.price_for_customer = product.price_for_customer || 0;
        this.price_for_seller = product.price_for_seller || 0;
        this.stock = product.stock || 100;
        this.sold = product.sold || 0;
        this.view = product.view || 0;
        this.point = product.point || 0;
        this.profit = product.profit || 0;
        this.discount = product.discount || 0;
        this.destroy = product.destroy || enum_1.ProductStatus.Hidden;
        this.created_at = product.created_at || new Date();
        this.updated_at = product.updated_at || new Date();
    }
}
exports.default = Product;
