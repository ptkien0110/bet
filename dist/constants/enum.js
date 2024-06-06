"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStatus = exports.CategoryStatus = exports.TokenType = exports.UserVerifyStatus = exports.ROLE = void 0;
var ROLE;
(function (ROLE) {
    ROLE[ROLE["ADMIN"] = 0] = "ADMIN";
    ROLE[ROLE["SELLER"] = 1] = "SELLER";
    ROLE[ROLE["CUSTOMER"] = 2] = "CUSTOMER";
})(ROLE || (exports.ROLE = ROLE = {}));
var UserVerifyStatus;
(function (UserVerifyStatus) {
    UserVerifyStatus[UserVerifyStatus["Unverified"] = 0] = "Unverified";
    UserVerifyStatus[UserVerifyStatus["Verified"] = 1] = "Verified";
    UserVerifyStatus[UserVerifyStatus["Banned"] = 2] = "Banned"; // bị khóa
})(UserVerifyStatus || (exports.UserVerifyStatus = UserVerifyStatus = {}));
var TokenType;
(function (TokenType) {
    TokenType[TokenType["AccessToken"] = 0] = "AccessToken";
    TokenType[TokenType["RefreshToken"] = 1] = "RefreshToken";
})(TokenType || (exports.TokenType = TokenType = {}));
var CategoryStatus;
(function (CategoryStatus) {
    CategoryStatus[CategoryStatus["Visible"] = 0] = "Visible";
    CategoryStatus[CategoryStatus["Hidden"] = 1] = "Hidden";
})(CategoryStatus || (exports.CategoryStatus = CategoryStatus = {}));
var ProductStatus;
(function (ProductStatus) {
    ProductStatus[ProductStatus["Visible"] = 0] = "Visible";
    ProductStatus[ProductStatus["Hidden"] = 1] = "Hidden";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
