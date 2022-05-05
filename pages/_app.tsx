import { ReactNode } from "react";
import { NextPage } from "next";
import { AppProps } from "next/app";

import { ApolloProvider } from "@apollo/client";
import { Web3ReactProvider } from "@web3-react/core";
import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { chain, createClient, WagmiProvider } from 'wagmi';

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
import '@rainbow-me/rainbowkit/styles.css';

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [
    apiProvider.alchemy(process.env.ALCHEMY_ID),
    apiProvider.fallback()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

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
      <WagmiProvider client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <AuthProvider>
            <ChakraProvider theme={theme}>
              <MainLayout NavElement={NavElement}>
                <Component {...pageProps} />
              </MainLayout>
            </ChakraProvider>
          </AuthProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </ApolloProvider>
  );
}
