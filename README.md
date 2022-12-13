# Social Media App Backend

This is the GraphQL Apollo Server that serves as the backend for the Social Media App. The server exposes a GraphQL API that allows clients to perform operations such as querying and mutating data. Feel free to check out this [*blog post*](https://eliaswambugu.medium.com/another-instagram-clone-9b93c3d4b494) I made about the app.

# Requirements
- [Node.js](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/)

# Getting Started

Clone this repo 
```bash
git clone https://github.com/HelixHEX/exposure-server
```

Install the required dependencies by running
```bash
yarn install
```

## Environment Variables

The server uses environment variables to configure the database connection. The following environment variables are required:

- `DATABASE_URL` - The database connection string. This is used to connect to the database. The connection string should be in the format `postgresql://<username>:<password>@<host>:<port>/<database_name>?schema=<schema>`. The schema is optional. If not specified, the default schema is `public`. The `database_name` in this case it will be `exposure` or whatever you decide to name it.

- `PORT` - The port on which the server will listen for requests. The default value is `4000`.

- `JWT_SECRET` - The secret used to sign the JWT tokens. This is used to authenticate requests to the server.

- `REFRESH_TOKEN_SECRET` - The secret used to sign the refresh tokens. This is used to authenticate requests to the server. (Feature not implemented yet)


## Database

The server uses a PostgreSQL database to store data. The database schema is defined in the [schema.prisma](./prisma/schema.prisma) file. The schema is used to generate the database client, which is used to perform operations on the database.

To generate the database client, run
```bash
npx prisma generate
```

To create the database, run. This will create a database named `exposure` in your local PostgreSQL instance.
```bash
npx prisma migrate dev --name init
```

## Server

Start the server by running 
```bash 
yarn dev
```

# API Reference

The server exposes a single endpoint at /graphql, which accepts both GET and POST requests. The GraphQL query or mutation can be sent as part of the request body.

Here are some examples of the types of operations that can be performed using the API:

## Querying data

```graphql
query Posts {
  posts {
    id
    createdAt
    description
    image_url
    profile {
      id
      username
    }
    likes {
      id
      profile_id
    }
  }
}
```

## Mutating data

```graphql
mutation CreatePost($description: String!, $image_url: String!) {
  createPost(description: $description, image_url: $image_url) {
    id
    profile_id
    description
    image_url
  }
}
```

# Refer to the schema.graphql [*file*](https://github.com/HelixHEX/exposure-app/blob/main/graphql/schema.gql) for a complete list of the available operations.