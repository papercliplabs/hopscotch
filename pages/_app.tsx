import { ReactNode } from "react";
import { NextPage } from "next";
import { AppProps } from "next/app";

import { ApolloProvider } from "@apollo/client";
import { getDefaultWallets, RainbowKitProvider } from "@papercliplabs/rainbowkit";
import { createClient, configureChains, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { ChakraProvider } from "@chakra-ui/react";
import { publicProvider } from "wagmi/providers/public";

import { theme } from "@/theme";
import { useApollo } from "@/graphql/apollo";
import { MainLayout } from "@/layouts/Main";
import { AuthProvider } from "@/providers/auth";

import "@fontsource/inter";
import "@papercliplabs/rainbowkit/styles.css";
import { SUPPORTED_CHAINS } from "@/common/constants";
import TokenListProvider from "@/hooks/useTokenList/provider";
import { NestedPortalRefProvider } from "@/components/NestedPortal";

const { chains, provider } = configureChains(SUPPORTED_CHAINS, [
  alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
  publicProvider(),
]);

const { connectors } = getDefaultWallets({
  appName: "Hopscotch",
  chains,
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

type NextPageWithLayout = NextPage & {
  NavElement?: () => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const apolloClient = useApollo();

  return (
    <ApolloProvider client={apolloClient}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} showRecentTransactions={true}>
          <AuthProvider>
            <TokenListProvider>
              <ChakraProvider theme={theme}>
                <NestedPortalRefProvider>
                  <MainLayout>
                    <Component {...pageProps} />
                  </MainLayout>
                </NestedPortalRefProvider>
              </ChakraProvider>
            </TokenListProvider>
          </AuthProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </ApolloProvider>
  );
}
