"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getUser = (token) => {
    if (token) {
        try {
            let decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            return decoded;
        }
        catch (err) {
            return null;
        }
    }
    return null;
};
exports.getUser = getUser;
//# sourceMappingURL=getUser.js.map