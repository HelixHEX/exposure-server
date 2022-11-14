"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileTypedefs = void 0;
exports.profileTypedefs = `
  type Profile {
    id: ID!
    name: String!
    bio: String!
    username: String!
    user: User!
    user_id: Int!
  }

  type Query {
    profiles: [Profile!]!
  }

  type Mutation {
    createProfile(name: String!, bio: String!, username: String!): Profile!
  }
  
`;
//# sourceMappingURL=typedefs.js.map