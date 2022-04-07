# Invoice App

## Running the backend (Hasura)

### For the first time

**0. Prerequisites**

1. Install [hasura-cli](https://hasura.io/docs/latest/graphql/core/hasura-cli/install-hasura-cli.html#install-hasura-cli)
2. Install [docker & docker-compose](https://docs.docker.com/compose/install/)

**1. Start the server**

In one terminal window start the hasura server

```sh
cd hasura/
docker-compose up
```

**2. Apply Metadata and Migrations**
_The next steps are based on https://hasura.io/docs/latest/graphql/core/migrations/migrations-setup.html#step-7-apply-the-migrations-and-metadata-on-another-instance-of-the-graphql-engine_

```sh
cd hasura/
./applyMetadataMigrations.sh
```

### Starting the API server

```sh
cd hasura/
./applyMetadataMigrations.sh
docker-compose up
```

### Editing the API server

**⚠️ Always use the hasura console instead of going to the server directly. This is so changes are saved as commitable migrations**

```sh
hasura console --admin-secret=squidsquidsquid
```

## Running the frontend

### For the first time

```sh
cp .env.template .env
yarn dev
```

### If youve changed the graphql schema

This project uses codegen to create the hooks and functions for calling our backend. After you've made a change to the Graphql (hasura) schema make sure to run the following to re-generate these functions

```sh
yarn generate
```

## Other Notes

### Modifying Hasuras metadata file

It may in rare cases be nessesary to edit hasuras yaml files directly. If you do this make sure to run

```sh
hasura metadata apply --admin-secret=squidsquidsquid
```

Afterwards to see the changes apply in the console

### TypeScript and GraphQL Example

One of the strengths of GraphQL is [enforcing data types on runtime](https://graphql.github.io/graphql-spec/June2018/#sec-Value-Completion). Further, TypeScript and [GraphQL Code Generator](https://graphql-code-generator.com/) (graphql-codegen) make it safer by typing data statically, so you can write truly type-protected code with rich IDE assists.

This template extends [Apollo Server and Client Example](https://github.com/vercel/next.js/tree/canary/examples/api-routes-apollo-server-and-client#readme) by rewriting in TypeScript and integrating [graphql-let](https://github.com/piglovesyou/graphql-let#readme), which runs [TypeScript React Apollo](https://graphql-code-generator.com/docs/plugins/typescript-react-apollo) in [graphql-codegen](https://github.com/dotansimha/graphql-code-generator#readme) under the hood. It enhances the typed GraphQL use as below:

```tsx
import { useNewsQuery } from './news.graphql'

const News = () => {
	// Typed already️⚡️
	const { data: { news } } = useNewsQuery()

	return <div>{news.map(...)}</div>
}
```

By default `**/*.graphqls` is recognized as GraphQL schema and `**/*.graphql` as GraphQL documents. If you prefer the other extensions, make sure the settings of the webpack loader in `next.config.js` and `.graphql-let.yml` are consistent.
