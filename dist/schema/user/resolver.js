"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolver = void 0;
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.userResolver = {
    Query: {
        users: (_parent, _args, { context }) => {
            return context.prisma.user.findMany();
        },
        user: (_parent, args, { context }) => {
            return context.prisma.user.findUnique({
                where: {
                    id: args.id,
                },
            });
        },
    },
    Mutation: {
        createUser: (_parent, args, { context: { prisma, res } }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
                where: {
                    email: args.email,
                },
            });
            if (user) {
                throw new Error("Email is already taken");
            }
            const hashedPassword = yield bcrypt.hash(args.password, 10);
            const newUser = yield prisma.user.create({
                data: {
                    email: args.email,
                    password: hashedPassword,
                },
            });
            const profile = yield prisma.profile.findUnique({
                where: {
                    id: args.profile_id,
                },
            });
            if (!profile) {
                throw new Error("Profile does not exist");
            }
            if (profile.user_id) {
                throw new Error("Profile is already connected to a user");
            }
            yield prisma.profile.update({
                where: {
                    id: args.profile_id,
                },
                data: {
                    user: {
                        connect: {
                            id: newUser.id,
                        },
                    },
                },
            });
            console.log("process.env.JWT_SECRET");
            const accessToken = jsonwebtoken_1.default.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });
            res.cookie("access-token", accessToken, {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
            let { password } = newUser, rest = __rest(newUser, ["password"]);
            return rest;
        }),
        login: (_parent, args, { context: { res, req, prisma } }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
                where: {
                    email: args.email,
                },
            });
            if (!user) {
                throw new Error("Incorrect email or password");
            }
            const valid = yield bcrypt.compare(args.password, user.password);
            if (!valid) {
                throw new Error("Incorrect email or password");
            }
            const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, "process.env.REFRESH_TOKEN_SECRET", {
                expiresIn: "7d",
            });
            const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, "process.env.JWT_SECRET");
            let { password } = user, rest = __rest(user, ["password"]);
            return {
                user: rest,
                token: accessToken,
            };
        }),
    },
    User: {
        profile: (parent, _args, { context }) => {
            return context.prisma.profile.findUnique({
                where: {
                    id: parent.profile_id,
                },
            });
        },
    },
};
//# sourceMappingURL=resolver.js.map