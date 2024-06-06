"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("../../constants/enum");
class Category {
    _id;
    name;
    status;
    constructor({ _id, name, status }) {
        this._id = _id;
        this.name = name;
        this.status = status || enum_1.CategoryStatus.Visible;
    }
}
exports.default = Category;
