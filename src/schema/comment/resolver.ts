import { Context } from "../../context";

export const commentResolver = {
  Query: {
    comments: async (
      _parent: any,
      args: { post_id: number },
      { context: { prisma } }: { context: Context }
    ) => {
      console.log(args.post_id)
      let comments = await prisma.comment.findMany({
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
    },
  },

  Mutation: {
    createComment: async (
      _parent: any,
      args: { comment: string; post_id: number },
      { context: { user, prisma } }: { context: Context }
    ) => {
      if (user) {
        let comment = await prisma.comment.create({
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
      } else {
        throw new Error("You must be logged in to create a comment");
      }
    },
  },
};
