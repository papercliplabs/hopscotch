import { ReactNode } from "react";
import { NextPage } from "next";
import { AppProps } from "next/app";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createClient, configureChains, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { ChakraProvider } from "@chakra-ui/react";
import { publicProvider } from "wagmi/providers/public";

import { theme } from "@/theme";
import { MainLayout } from "@/layouts/Main";

import "@fontsource/inter";
import "@rainbow-me/rainbowkit/styles.css";
import { SUPPORTED_CHAINS } from "@/common/constants";
import TokenListProvider from "@/hooks/useTokenList/provider";

import "@/styles/fonts.css";
import { useIsMounted } from "@/hooks/useIsMounted";
import { CustomAvatar } from "@/components/WalletAvatar";

const { chains, provider } = configureChains(SUPPORTED_CHAINS, [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
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
    return (
        <>
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider chains={chains} showRecentTransactions={true} avatar={CustomAvatar}>
                    <TokenListProvider>
                        <ChakraProvider theme={theme}>
                            <MainLayout>
                                <Component {...pageProps} />
                            </MainLayout>
                        </ChakraProvider>
                    </TokenListProvider>
                </RainbowKitProvider>
            </WagmiConfig>
        </>
    );
}
