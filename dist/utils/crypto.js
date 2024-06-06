"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = exports.sha256 = void 0;
const dotenv_1 = require("dotenv");
const node_crypto_1 = require("node:crypto");
(0, dotenv_1.config)();
/**
 * Returns a SHA256 hash using SHA-2 for the given `content`.
 *
 * @see https://en.wikipedia.org/wiki/SHA-2
 *
 * @param {String} content
 *
 * @returns {String}
 */
function sha256(content) {
    return (0, node_crypto_1.createHash)('sha256').update(content).digest('hex');
}
exports.sha256 = sha256;
function hashPassword(password) {
    return sha256(password + process.env.PASSWORD_SECRET);
}
exports.hashPassword = hashPassword;
