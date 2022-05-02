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

const infuraId = process.env.INFURA_ID;

const provider = ({ chainId }: { chainId: number }) => new providers.InfuraProvider(chainId, infuraId);

const chains: Chain[] = [
    { ...chain.mainnet, name: "Ethereum" },
    { ...chain.polygonMainnet, name: "Polygon" },
    // { ...chain.optimism, name: "Optimism" },
    // { ...chain.arbitrumOne, name: "Arbitrum" },
];

const wallets = getDefaultWallets({
    chains,
    infuraId,
    appName: "My RainbowKit App",
    jsonRpcUrl: ({ chainId }) => chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ?? chain.mainnet.rpcUrls[0],
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
