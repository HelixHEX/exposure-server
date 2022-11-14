export const userTypeDefs = `
  type User {
    id: ID!
    email: String!
    password: String!
    profile: Profile
    profile_id: Int
  }
  type Query {
    user(id: Int!): User
    users: [User!]!
  }

  type SigninResponse {
    token: String!
    user: User!
    error: String
  }

  type Mutation {
    login(email: String!, password: String!): SigninResponse!
    createUser(email: String!, password: String!, profile_id: Int!): User!
  }
`;