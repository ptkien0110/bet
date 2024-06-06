"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("../../constants/enum");
class User {
    _id;
    name;
    email;
    password;
    address;
    avatar;
    phone;
    date_of_birth;
    aff_code;
    parent_aff_code;
    roles;
    verify;
    created_at;
    updated_at;
    constructor(user) {
        const date = new Date();
        this._id = user._id;
        this.name = user.name;
        this.email = user.email;
        this.password = user.password;
        this.address = user.address;
        this.avatar = user.avatar || '';
        this.phone = user.phone;
        this.date_of_birth = user.date_of_birth || date;
        this.aff_code = user.aff_code || '';
        this.parent_aff_code = user.parent_aff_code || '';
        this.roles = user.roles || enum_1.ROLE.CUSTOMER;
        this.verify = user.verify || enum_1.UserVerifyStatus.Unverified;
        this.created_at = user.created_at || date;
        this.updated_at = user.updated_at || date;
    }
}
exports.default = User;
