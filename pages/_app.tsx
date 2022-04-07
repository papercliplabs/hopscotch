import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../graphql/apollo";
import { Web3ReactProvider } from "@web3-react/core";
import {
  ExternalProvider,
  JsonRpcFetchFunc,
  Web3Provider,
} from "@ethersproject/providers";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/theme";
function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc) {
  return new Web3Provider(provider);
}

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo();

  return (
    <ApolloProvider client={apolloClient}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </Web3ReactProvider>
    </ApolloProvider>
  );
}
