"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentTypeDefs = void 0;
exports.commentTypeDefs = `
  type Comment {
    id: Int!
    createdAt: String!
    updatedAt: String!
    comment: String!
    post: Post!
    post_id: Int!
    profile: Profile!
    profile_id: Int!
  }

  type CommentResponse {
    comment: Comment
  }

  type Query {
    comments(post_id: Int!): [Comment!]!
  }

  type Mutation {
    createComment(comment: String!, post_id: Int!): CommentResponse!
  }
`;
//# sourceMappingURL=typeDefs.js.map