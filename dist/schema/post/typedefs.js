"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postTypeDefs = void 0;
exports.postTypeDefs = `
  type Like {
    id: Int!
    profile: Profile!
    profile_id: Int!
    post: Post!
    post_id: Int!
  }

  type Post {
    id: Int!
    createdAt: String!
    updatedAt: String!
    description: String!
    image_url: String!
    profile: Profile!
    profile_id: Int!
    likes: [Like!]!
    comments: [Comment!]!
  }

  type PostResponse {
    post: Post
  }
  
  type Query {
    post(id: Int!): Post
    posts: [Post!]!
  }

  type LikeResponse {
    like: Like
  }

  type Mutation {
    createPost(description: String!, image_url: String!): Post!
    likePost(post_id: Int!): LikeResponse!
    unlikePost(post_id: Int! like_id: Int!): PostResponse!
  }
`;
//# sourceMappingURL=typeDefs.js.map