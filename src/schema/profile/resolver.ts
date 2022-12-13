import { Context } from "../../context";

export const profileResolver = {
  Query: {
    profiles: (_parent: any, _args: any, { context }: { context: Context }) => {
      return context.prisma.profile.findMany();
    },
    profile: async (
      _parent: any,
      args: { username: string, me: boolean },
      { context }: { context: Context }
    ) => {
      if (args.me) {
        let profile = await context.prisma.profile.findUnique({
          where: {
            id: context.user?.profile.id
          },
          include: {
          post: true,
        }
        })
        return profile
      } else {
        let profile = await context.prisma.profile.findUnique({
        where: {
          username: args.username,
        },
        include: {
          post: true,
        }
      });
      return profile
      }
    }
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

  //Potential security issue
  // Profile: {
  //   user: (parent: any, _args: any, { context }: { context: Context }) => {
  //     return context.prisma.user.findUnique({
  //       where: {
  //         id: parent.user_id,
  //       },
  //     });
  //   },
  // },
};
