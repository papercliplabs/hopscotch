import { ReactNode, useEffect } from "react";
import { NextPage } from "next";
import { AppProps } from "next/app";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { useRouter } from "next/router";

import { ChakraProvider } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";

import { theme } from "@/theme";
import { MainLayout } from "@/layouts/Main";

import "@fontsource/inter";
import "@rainbow-me/rainbowkit/styles.css";
import { SUPPORTED_CHAINS } from "@/common/constants";
import TokenListProvider from "@/hooks/useTokenList/provider";

import "@/styles/fonts.css";
import { CustomAvatar } from "@/components/WalletAvatar";
import { stringToNumber } from "@/common/utils";

const { chains, publicClient, webSocketPublicClient } = configureChains(SUPPORTED_CHAINS, [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
    // publicProvider(),
]);

const { connectors } = getDefaultWallets({
    appName: "Hopscotch",
    projectId: "19871371bca59bf47d7e31420e3a1994",
    chains,
});

export const wagmiConfig = createConfig({
    autoConnect: false,
    connectors,
    publicClient,
    webSocketPublicClient,
});

type NextPageWithLayout = NextPage & {
    NavElement?: () => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    useEffect(() => {
        // Manually trigger autoconnect after mounted
        wagmiConfig.autoConnect();
    }, []);

    // Default initial chain to request chain if it is a request
    const router = useRouter();
    const parsedChainId = Array.isArray(router.query?.chain) ? undefined : router.query?.chain;
    const chainId = stringToNumber(parsedChainId) ?? SUPPORTED_CHAINS[0].id;

    return (
        <>
            <WagmiConfig config={wagmiConfig}>
                <RainbowKitProvider
                    chains={chains}
                    showRecentTransactions={true}
                    avatar={CustomAvatar}
                    initialChain={chainId}
                >
                    <TokenListProvider>
                        <ChakraProvider theme={theme}>
                            <MainLayout>
                                <Component {...pageProps} />
                                <Analytics />
                            </MainLayout>
                        </ChakraProvider>
                    </TokenListProvider>
                </RainbowKitProvider>
            </WagmiConfig>
        </>
    );
}
