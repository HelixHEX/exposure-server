import { Context } from "../../context";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userResolver = {
  Query: {
    users: (_parent: any, _args: any, { context }: { context: Context }) => {
      return context.prisma.user.findMany();
    },
    user: (
      _parent: any,
      args: { id: number },
      { context }: { context: Context }
    ) => {
      return context.prisma.user.findUnique({
        where: {
          id: args.id,
        },
      });
    },
    currentUser: (
      _parent: any,
      _args: any,
      { context: { user } }: { context: Context }
    ) => {
      if (!user) {
        return null;
      }
      return user;
    },
  },
  Mutation: {
    // create account
    createUser: async (
      _parent: any,
      args: { email: string; password: string; profile_id: number },
      { context: { prisma } }: { context: Context }
    ) => {
      // check if email is already taken
      const user = await prisma.user.findUnique({
        where: {
          email: args.email,
        },
      });

      if (user) {
        throw new Error("Email is already taken");
      }

      // hash password
      const hashedPassword = await bcrypt.hash(args.password, 10);

      // create user
      const newUser = await prisma.user.create({
        data: {
          email: args.email,
          password: hashedPassword,
        },
      });

      // connect profile to user

      // check if profile exists and if it is already connected to a user
      const profile = await prisma.profile.findUnique({
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

      await prisma.profile.update({
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

      // create token
      let tokenData = {
        id: newUser.id,
        email: newUser.email,
        profile_id: newUser.profile_id,
      };
      const refreshToken = jwt.sign(
        tokenData,
        "process.env.REFRESH_TOKEN_SECRET",
        {
          expiresIn: "7d",
        }
      );

      const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      let { password, ...rest } = newUser;

      return {
        user: rest,
        token,
        refreshToken,
      };
    },

    // login with email and password
    login: async (
      _parent: any,
      args: { email: string; password: string },
      { context: { prisma } }: { context: Context }
    ) => {
      const user = await prisma.user.findUnique({
        where: {
          email: args.email,
        },
        include: {
          profile: true,
        },
      });
      if (!user) {
        throw new Error("Incorrect email or password");
      }
      const valid = await bcrypt.compare(args.password, user.password);

      if (!valid) {
        throw new Error("Incorrect email or password");
      }

      let tokenData = {
        id: user.id,
        email: user.email,
        profile: user.profile,
      };

      const refreshToken = jwt.sign(
        tokenData,
        "process.env.REFRESH_TOKEN_SECRET",
        {
          expiresIn: "7d",
        }
      );

      const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      let { password, ...rest } = user;

      return {
        user: rest,
        token,
        refreshToken,
      };
    },
  },
  User: {
    profile: (parent: any, _args: any, { context }: { context: Context }) => {
      return context.prisma.profile.findUnique({
        where: {
          id: parent.profile_id,
        },
      });
    },
  },
};
