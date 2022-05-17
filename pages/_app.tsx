import { ReactNode } from "react";
import { NextPage } from "next";
import { AppProps } from "next/app";

import { ApolloProvider } from "@apollo/client";
import { apiProvider, configureChains, getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createClient, WagmiProvider } from "wagmi";
import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "@/theme";
import { useApollo } from "@/graphql/apollo";
import { MainLayout } from "@/layouts/Main";
import { AuthProvider } from "@/providers/auth";

import "@fontsource/inter";
import "@rainbow-me/rainbowkit/styles.css";
import { SUPPORTED_CHAINS } from "@/common/constants";

const { chains, provider } = configureChains(SUPPORTED_CHAINS, [
  apiProvider.alchemy(process.env.ALCHEMY_ID),
  apiProvider.fallback(),
]);

const { connectors } = getDefaultWallets({
  appName: "Hopscotch",
  chains,
});

const wagmiClient = createClient({
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
      <WagmiProvider client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <AuthProvider>
            <ChakraProvider theme={theme}>
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            </ChakraProvider>
          </AuthProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </ApolloProvider>
  );
}
