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
  },
  Mutation: {
    // create account
    createUser: async (
      _parent: any,
      args: { email: string; password: string; profile_id: number },
      { context: { prisma, res } }: { context: Context }
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
      console.log("process.env.JWT_SECRET");
      const accessToken = jwt.sign(
        { userId: newUser.id },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.cookie("access-token", accessToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      let { password, ...rest } = newUser;

      // send token and user back to the client
      return rest;
    },

    // login with email and password
    login: async (
      _parent: any,
      args: { email: string; password: string },
      { context: { res, req, prisma } }: { context: Context }
    ) => {
      const user = await prisma.user.findUnique({
        where: {
          email: args.email,
        },
      });
      if (!user) {
        throw new Error("Incorrect email or password");
      }
      const valid = await bcrypt.compare(args.password, user.password);

      if (!valid) {
        throw new Error("Incorrect email or password");
      }
      const refreshToken = jwt.sign(
        { userId: user.id },
        "process.env.REFRESH_TOKEN_SECRET",
        {
          expiresIn: "7d",
        }
      );

      const accessToken = jwt.sign(
        { userId: user.id },
        "process.env.JWT_SECRET"
      );

      let { password, ...rest } = user;

      return {
        user: rest,
        token: accessToken,
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
