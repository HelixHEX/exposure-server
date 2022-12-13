"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileTypedefs = void 0;
exports.profileTypedefs = `
  type Profile {
    id: Int!
    name: String!
    bio: String!
    username: String!
    user: User!
    user_id: Int!
    private: Boolean!
    post: [Post!]!
  }

  type Query {
    profiles: [Profile!]!
    profile(username: String!, me: Boolean): Profile!
  }

  type Mutation {
    createProfile(name: String!, bio: String!, username: String!): Profile!
  }
  
`;
//# sourceMappingURL=typedefs.js.map