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
exports.postResolver = void 0;
exports.postResolver = {
    Query: {
        posts: (_parent, _args, { context: { user, prisma } }) => __awaiter(void 0, void 0, void 0, function* () {
            let posts = yield prisma.post.findMany({
                where: {
                    profile: {
                        private: false,
                    },
                },
                include: {
                    profile: true,
                    likes: {
                        where: {
                            profile_id: user === null || user === void 0 ? void 0 : user.profile.id,
                        },
                        select: {
                            id: true,
                            profile_id: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
            return posts;
        }),
        post: (_parent, args, { context: { user, prisma } }) => __awaiter(void 0, void 0, void 0, function* () {
            let post = yield prisma.post.findUnique({
                where: {
                    id: args.id,
                },
                include: { profile: { include: { followedBy: true } } },
            });
            if (post) {
                if (user) {
                    if (user.profile.id !== post.profile_id) {
                        if (post.profile.private) {
                            if (post.profile.followedBy.find((follower) => follower.id === user.id)) {
                                return post;
                            }
                            else {
                                throw new Error("This profile is private");
                            }
                        }
                        else {
                            return post;
                        }
                    }
                    else {
                        return post;
                    }
                }
                else {
                    if (post.profile.private) {
                        throw new Error("Post is private");
                    }
                    else {
                        return post;
                    }
                }
            }
            else {
                throw new Error("Post not found");
            }
        }),
    },
    Mutation: {
        createPost: (_parent, args, { context: { user, prisma } }) => __awaiter(void 0, void 0, void 0, function* () {
            if (user === null || user === void 0 ? void 0 : user.profile.id) {
                return prisma.post.create({
                    data: {
                        description: args.description,
                        image_url: args.image_url,
                        profile: { connect: { id: user.profile.id } },
                    },
                });
            }
            else
                throw new Error("You must be logged in to create a post");
        }),
        likePost: (_parent, args, { context: { user, prisma } }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (user === null || user === void 0 ? void 0 : user.profile.id) {
                    const post = yield prisma.post.findUnique({
                        where: {
                            id: args.post_id,
                        },
                    });
                    if (!post) {
                        throw new Error("Post not found");
                    }
                    const postLike = yield prisma.like.findFirst({
                        where: {
                            profile_id: user.profile.id,
                            post_id: args.post_id,
                        },
                    });
                    if (postLike) {
                        throw new Error("Post already liked");
                    }
                    else {
                        let like = yield prisma.like.create({
                            data: {
                                profile: { connect: { id: user.profile.id } },
                                post: { connect: { id: args.post_id } },
                            },
                        });
                        return { like };
                    }
                }
                else
                    throw new Error("You must be logged in to like a post");
            }
            catch (e) {
                console.log(e);
                throw new Error("Error liking post");
            }
        }),
        unlikePost: (_parent, args, { context: { user, prisma } }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (user === null || user === void 0 ? void 0 : user.profile.id) {
                    const post = yield prisma.post.findUnique({
                        where: {
                            id: args.post_id,
                        },
                    });
                    if (!post) {
                        throw new Error("Post not found");
                    }
                    const postLike = yield prisma.like.findUnique({
                        where: {
                            id: args.like_id,
                        },
                    });
                    if (postLike) {
                        if (postLike.post_id === args.post_id) {
                            yield prisma.like.delete({
                                where: {
                                    id: args.like_id,
                                },
                            });
                            return { post };
                        }
                        else {
                            throw new Error("Post not liked");
                        }
                    }
                    else {
                        throw new Error("Post not liked");
                    }
                }
                else
                    throw new Error("You must be logged in to unlike a post");
            }
            catch (e) {
                console.log(e);
                throw new Error("Error unliking post");
            }
        }),
    },
};
//# sourceMappingURL=resolver.js.map