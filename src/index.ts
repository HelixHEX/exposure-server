import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
// import { expressMiddleware } from "@apollo/server/express4";
// import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
// import express from "express";
// import http from "http";
// import cors from "cors";
// import { json } from "body-parser";
import { Context, context } from "./context";
import { schema } from "./schema";
import { getUser } from "./utils/getUser";

require("dotenv-safe").config();

interface MyContext {
  //prisma client
  context: Context;
}

const main = async () => {
  const server = new ApolloServer<MyContext>({
    schema,
  });
  // console.log(process.env.JWT_SECRET)
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      const user = getUser(token);
      return {
        context: {
          ...context,
          user,
        },
      };
    },
  });

  console.log(`🚀 Server ready at ${url}`);
};

main();
