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

**2. Create your database**

We need to manually tell your local docker instance to use the postgres database running in docker-compose.

*The next steps are based on https://hasura.io/docs/latest/graphql/core/getting-started/docker-simple.html*
1. Open the console
```sh
cd hasura/
hasura console
```
2. Go to the `Data` tab
3. Under connect database set the name to `default`
4. Select `Environment Variable`
5. Paste `PG_DATABASE_URL`

**3. Apply Metadata and Migrations**
*The next steps are based on https://hasura.io/docs/latest/graphql/core/migrations/migrations-setup.html#step-7-apply-the-migrations-and-metadata-on-another-instance-of-the-graphql-engine*
```sh
cd hasura/
hasura metadata apply --endpoint http://localhost:8080
hasura migrate apply --all-databases --endpoint http://localhost:8080
hasura metadata reload --endpoint http://localhost:8080
```

### Starting the API server
```sh
docker-compose up
```

### Editing the API server
**⚠️ Always use the hasura console instead of going to the server directly. This is so changes are saved as commitable migrations**
```sh
hasura console
```

## Running the frontend
```sh
yarn dev
```

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


