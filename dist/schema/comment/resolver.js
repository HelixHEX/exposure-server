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
exports.commentResolver = void 0;
exports.commentResolver = {
    Query: {
        comments: (_parent, args, { context: { prisma } }) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(args.post_id);
            let comments = yield prisma.comment.findMany({
                where: {
                    post_id: args.post_id,
                },
                include: {
                    profile: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
            return comments;
        }),
    },
    Mutation: {
        createComment: (_parent, args, { context: { user, prisma } }) => __awaiter(void 0, void 0, void 0, function* () {
            if (user) {
                let comment = yield prisma.comment.create({
                    data: {
                        comment: args.comment,
                        post: {
                            connect: {
                                id: args.post_id,
                            },
                        },
                        profile: {
                            connect: {
                                id: user.profile.id,
                            },
                        },
                    },
                    include: {
                        profile: true,
                    },
                });
                return { comment };
            }
            else {
                throw new Error("You must be logged in to create a comment");
            }
        }),
    },
};
//# sourceMappingURL=resolver.js.map