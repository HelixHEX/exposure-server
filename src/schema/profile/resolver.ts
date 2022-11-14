import { Context } from "../../context";

export const profileResolver = {
  Query: {
    profiles: (_parent: any, _args: any, { context }: { context: Context }) => {
      return context.prisma.profile.findMany();
    },
  },
  Mutation: {
    createProfile: async (
      _parent: any,
      args: { name: string, bio: string, username: string },
      { context: {prisma} }: { context: Context }
    ) => {
      // check if username is already taken
      const user = await prisma.profile.findUnique({
        where: {
          username: args.username,
        }
      })

      if (user) {
        throw new Error("Username is already taken")
      }

      return prisma.profile.create({
        data: {
          name: args.name,
          bio: args.bio,
          username: args.username,
        }
      })
    },
  },

  Profile: {
    user: (parent: any, _args: any, { context }: { context: Context }) => {
      return context.prisma.user.findUnique({
        where: {
          id: parent.user_id,
        },
      });
    },
  },
};
