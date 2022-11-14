"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const schema_1 = require("@graphql-tools/schema");
const profile_1 = require("./profile");
const user_1 = require("./user");
exports.schema = (0, schema_1.makeExecutableSchema)({
    resolvers: [user_1.userResolver, profile_1.profileResolver],
    typeDefs: [user_1.userTypeDefs, profile_1.profileTypedefs],
});
//# sourceMappingURL=index.js.map