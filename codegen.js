module.exports = {
  schema: [
    {
      "http://localhost:8080/v1/graphql": {
        headers: {
          // todo, move these to env vars
          "x-hasura-admin-secret": "squidsquidsquid",
        },
      },
    },
  ],
  documents: ["./graphql/**/*.graphql"],
  overwrite: true,
  generates: {
    "./graphql/generated/graphql.tsx": {
      plugins: ["typescript", "typescript-operations", "typescript-react-apollo"],
      config: {
        skipTypename: false,
        withHooks: true,
        withHOC: false,
        withComponent: false,
      },
    },
    "./graphql/generated/graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
};
