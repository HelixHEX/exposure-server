import { makeExecutableSchema } from "@graphql-tools/schema";
import { profileResolver, profileTypedefs } from "./profile";
import { userResolver, userTypeDefs } from "./user";

export const schema = makeExecutableSchema({
  resolvers: [userResolver, profileResolver],
  typeDefs: [userTypeDefs, profileTypedefs],
});
