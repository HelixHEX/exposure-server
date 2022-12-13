import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

export interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
  user: {
    id: number;
    email: string;
    profile: {
      id: number;
      name: string;
      bio: string;
      username: string;
      user_id: number;
      private: boolean;
    };
  } | null;
}

export const prisma = new PrismaClient();

export const context: Context = {
  prisma: prisma,
  req: express.request,
  res: express.response,
  user: null,
};
