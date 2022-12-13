"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileResolver = void 0;
exports.profileResolver = {
    Query: {
        profiles: (_parent, _args, { context }) => {
            return context.prisma.profile.findMany();
        },
        profile: (_parent, args, { context }) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (args.me) {
                let profile = yield context.prisma.profile.findUnique({
                    where: {
                        id: (_a = context.user) === null || _a === void 0 ? void 0 : _a.profile.id
                    },
                    include: {
                        post: true,
                    }
                });
                return profile;
            }
            else {
                let profile = yield context.prisma.profile.findUnique({
                    where: {
                        username: args.username,
                    },
                    include: {
                        post: true,
                    }
                });
                return profile;
            }
        })
    },
    Mutation: {
        createProfile: (_parent, args, { context: { prisma } }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.profile.findUnique({
                where: {
                    username: args.username,
                }
            });
            if (user) {
                throw new Error("Username is already taken");
            }
            return prisma.profile.create({
                data: {
                    name: args.name,
                    bio: args.bio,
                    username: args.username,
                }
            });
        }),
    },
};
//# sourceMappingURL=resolver.js.map