import { makeExecutableSchema } from "@graphql-tools/schema";
import { commentResolver, commentTypeDefs } from "./comment";
import { postResolver, postTypeDefs } from "./post";
import { profileResolver, profileTypedefs } from "./profile";
import { userResolver, userTypeDefs } from "./user";

export const schema = makeExecutableSchema({
  resolvers: [userResolver, profileResolver, postResolver, commentResolver],
  typeDefs: [userTypeDefs, profileTypedefs, postTypeDefs, commentTypeDefs],
});