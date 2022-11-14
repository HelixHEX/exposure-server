export const profileTypedefs = `
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
