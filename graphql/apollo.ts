import { useMemo } from "react";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  // We dont ahve access to the access token during server side rendering
  if (typeof window === "undefined") return {};

  // get the authentication accessToken from local storage if it exists
  const accessToken = localStorage.getItem("token");

  if (!accessToken) return {};

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      // authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

/**
 * Based on https://github.com/vercel/next.js/tree/canary/examples/with-apollo
 */
const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: authLink.concat(httpLink),
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
