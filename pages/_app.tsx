import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { Web3ReactProvider } from "@web3-react/core";
import {
  ExternalProvider,
  JsonRpcFetchFunc,
  Web3Provider,
} from "@ethersproject/providers";
import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "@/theme";
import { useApollo } from "@/graphql/apollo";
import { MainLayout } from "@/layouts/Main";
import { AuthProvider } from "@/providers/auth";

import '@fontsource/inter'
import { NextPage } from "next";
import { ReactNode } from "react";


function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc) {
  return new Web3Provider(provider);
}

type NextPageWithLayout = NextPage & {
  NavElement?: () => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}


export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const apolloClient = useApollo();
  const NavElement = Component?.NavElement;

  return (
    <ApolloProvider client={apolloClient}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <AuthProvider>
          <ChakraProvider theme={theme}>
            <MainLayout NavElement={NavElement}>
              <Component {...pageProps} />
            </MainLayout>
          </ChakraProvider>
        </AuthProvider>
      </Web3ReactProvider>
    </ApolloProvider>
  );
}
