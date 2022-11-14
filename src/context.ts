import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

export interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
}

const prisma = new PrismaClient();

export const context: Context = {
  prisma: prisma,
  req: express.request,
  res: express.response,
};
