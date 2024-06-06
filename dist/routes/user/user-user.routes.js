"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUserRouter = void 0;
const express_1 = require("express");
exports.userUserRouter = (0, express_1.Router)();
exports.userUserRouter.get('/products', (req, res) => {
    res.json({
        id: 1,
        text: 'hello world'
    });
});
