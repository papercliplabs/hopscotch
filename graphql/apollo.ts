import { useMemo } from "react";
import { ApolloClient, createHttpLink, InMemoryCache, NextLink, Operation, ServerError } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { deleteFromStorage } from "@rehooks/local-storage";
import { NetworkError } from "@apollo/client/errors";
import { GraphQLError } from "graphql";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  // We dont have access to the access token during server side rendering
  if (typeof window === "undefined") return {};

  // get the authentication accessToken from local storage if it exists
  const accessToken = localStorage.getItem("token");

  if (!accessToken) {
    return { headers };
  }

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

const onStartLink = setContext((_, { onStart }) => {
  // We dont have access to the access token during server side rendering
  if (typeof window === "undefined" || !onStart) return {};
  return onStart();
});

const handleNetworkError = (networkError: NetworkError) => {
  console.log(`[Network error]: ${networkError}`);
  const { statusCode } = networkError || ({} as any);
  if (statusCode === 401) {
    deleteFromStorage("token");
  }
};

const handleGraphQLError = (
  { message, locations, path, extensions }: GraphQLError,
  operation: Operation,
  forward: NextLink
) => {
  console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);

  if (extensions?.code === "invalid-jwt") {
    deleteFromStorage("token");
    const { authorization, ...headers } = operation.getContext().headers;
    operation.setContext({ headers });

    return forward(operation);
  }
};

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  console.log({ graphQLErrors, networkError });
  if (graphQLErrors) graphQLErrors.forEach((err) => handleGraphQLError(err, operation, forward));
  if (networkError) {
    handleNetworkError(networkError);
  }
});

/**
 * Based on https://github.com/vercel/next.js/tree/canary/examples/with-apollo
 */
const createApolloClient = () => {
  const link = onStartLink.concat(errorLink).concat(authLink).concat(httpLink);

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link,
    cache: new InMemoryCache(),
  });
};

let apolloClient = createApolloClient();

export const initializeApollo = () => {
  const _apolloClient = apolloClient ?? createApolloClient();

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export const useApollo = () => {
  const store = useMemo(() => initializeApollo(), []);
  return store;
};

export const clearCache = () => {
  if (apolloClient) {
    apolloClient.cache.reset();
  }
};
