import { Context } from "../../context";

export const postResolver = {
  Query: {
    posts: async (
      _parent: any,
      _args: any,
      { context: { user, prisma } }: { context: Context }
    ) => {
      let posts = await prisma.post.findMany({
        where: {
          profile: {
            private: false,
          },
        },
        include: {
          profile: true,
          likes: {
            where: {
              profile_id: user?.profile.id,
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
    },

    post: async (
      _parent: any,
      args: { id: number },
      { context: { user, prisma } }: { context: Context }
    ) => {
      let post = await prisma.post.findUnique({
        where: {
          id: args.id,
        },
        include: { profile: { include: { followedBy: true } } },
      });
      if (post) {
        if (user) {
          if (user.profile.id !== post.profile_id) {
            if (post.profile.private) {
              if (
                post.profile.followedBy.find(
                  (follower: any) => follower.id === user.id
                )
              ) {
                return post;
              } else {
                throw new Error("This profile is private");
              }
            } else {
              return post;
            }
          } else {
            return post;
          }
        } else {
          if (post.profile.private) {
            throw new Error("Post is private");
          } else {
            return post;
          }
        }
      } else {
        throw new Error("Post not found");
      }
    },
  },

  Mutation: {
    // check if user is logged in
    createPost: async (
      _parent: any,
      args: { description: string; image_url: string },
      { context: { user, prisma } }: { context: Context }
    ) => {
      if (user?.profile.id) {
        return prisma.post.create({
          data: {
            description: args.description,
            image_url: args.image_url,
            profile: { connect: { id: user.profile.id } },
          },
        });
      } else throw new Error("You must be logged in to create a post");
    },

    likePost: async (
      _parent: any,
      args: { post_id: number },
      { context: { user, prisma } }: { context: Context }
    ) => {
      try {
        if (user?.profile.id) {
          // check if post exists
          const post = await prisma.post.findUnique({
            where: {
              id: args.post_id,
            },
          });
          if (!post) {
            throw new Error("Post not found");
          }

          // check if post is already liked
          const postLike = await prisma.like.findFirst({
            where: {
              profile_id: user.profile.id,
              post_id: args.post_id,
            },
          });
          if (postLike) {
            throw new Error("Post already liked");
          } else {
            //like post
            let like = await prisma.like.create({
              data: {
                profile: { connect: { id: user.profile.id } },
                post: { connect: { id: args.post_id } },
              },
            });
            return {like}
          }
        } else throw new Error("You must be logged in to like a post");
      } catch (e) {
        console.log(e);
        throw new Error("Error liking post");
      }
    },

    unlikePost: async (
      _parent: any,
      args: { like_id: number; post_id: number },
      { context: { user, prisma } }: { context: Context }
    ) => {
      try {
        if (user?.profile.id) {
          // check if post exists
          const post = await prisma.post.findUnique({
            where: {
              id: args.post_id,
            },
          });
          if (!post) {
            throw new Error("Post not found");
          }

          // check if post is already liked
          const postLike = await prisma.like.findUnique({
            where: {
              id: args.like_id,
            },
          });

          if (postLike) {
            //unlike post
            if (postLike.post_id === args.post_id) {
              await prisma.like.delete({
                where: {
                  id: args.like_id,
                },
              });
              return {post}
            } else {
              throw new Error("Post not liked");
            }
          } else {
            throw new Error("Post not liked");
          }
        } else throw new Error("You must be logged in to unlike a post");
      } catch (e) {
        console.log(e);
        throw new Error("Error unliking post");
      }
    },
  },
};
