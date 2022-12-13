"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.context = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
exports.prisma = new client_1.PrismaClient();
exports.context = {
    prisma: exports.prisma,
    req: express_1.default.request,
    res: express_1.default.response,
    user: null,
};
//# sourceMappingURL=context.js.map