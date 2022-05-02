import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "@/theme";
import { useApollo } from "@/graphql/apollo";
import { MainLayout } from "@/layouts/Main";

import "@fontsource/inter";
import { NextPage } from "next";
import { ReactNode } from "react";

import "@rainbow-me/rainbowkit/styles.css";

import { RainbowKitProvider, Chain, getDefaultWallets, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { WagmiProvider, chain } from "wagmi";
import { providers } from "ethers";
import { CHAIN_INFO_LIST } from "@/common/constants";
import { SupportedChainId } from "@/common/enums";
import { getRpcUrlForChainId } from "@/common/utils";

const provider = ({ chainId }: { chainId: number | undefined }) =>
    new providers.JsonRpcProvider(getRpcUrlForChainId(chainId), chainId);

const chains: Chain[] = [
    { ...chain.mainnet, name: "Ethereum" },
    { ...chain.polygonMainnet, name: "Polygon" },
];

const wallets = getDefaultWallets({
    chains,
    appName: "My RainbowKit App",
    jsonRpcUrl: ({ chainId }) => getRpcUrlForChainId(chainId),
});

const connectors = connectorsForWallets(wallets);

type NextPageWithLayout = NextPage & {
    NavElement?: () => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const apolloClient = useApollo();
    const NavElement = Component?.NavElement;

    return (
        <ApolloProvider client={apolloClient}>
            <WagmiProvider autoConnect connectors={connectors} provider={provider}>
                <RainbowKitProvider chains={chains}>
                    <ChakraProvider theme={theme}>
                        <MainLayout NavElement={NavElement}>
                            <Component {...pageProps} />
                        </MainLayout>
                    </ChakraProvider>
                </RainbowKitProvider>
            </WagmiProvider>
        </ApolloProvider>
    );
}
