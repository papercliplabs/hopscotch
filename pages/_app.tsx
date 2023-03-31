import { ReactNode } from "react";
import { NextPage } from "next";
import { AppProps } from "next/app";

import { getDefaultWallets, RainbowKitProvider } from "@papercliplabs/rainbowkit";
import { createClient, configureChains, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { ChakraProvider } from "@chakra-ui/react";
import { publicProvider } from "wagmi/providers/public";

import { theme } from "@/theme";
import { MainLayout } from "@/layouts/Main";

import "@fontsource/inter";
import "@papercliplabs/rainbowkit/styles.css";
import { SUPPORTED_CHAINS } from "@/common/constants";
import TokenListProvider from "@/hooks/useTokenList/provider";
import { NestedPortalRefProvider } from "@/components/NestedPortal";

import "@/styles/fonts.css";
import { useIsMounted } from "@/hooks/useIsMounted";
import Head from 'next/head'

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
    // const isMounted = useIsMounted();

    // // Render after hydration as wagmi has issues with autoconnect if not
    // if (!isMounted) return null;

    return (
        <>
        <Head>
            <title>Hopscotch</title>
            <meta property="og:title" content="APP.tsx" />
            <meta property="og:site_name" content="hopscotch.cash/APP"/>
            <meta
                property="og:image"
                content={`https://${process.env.NEXT_PUBLIC_VERCEL_URL }/api/og?title=APP`}
            />
        </Head>
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains} showRecentTransactions={true}>
                <TokenListProvider>
                    <ChakraProvider theme={theme}>
                        <NestedPortalRefProvider>
                            <MainLayout>
                                <Component {...pageProps} />
                            </MainLayout>
                        </NestedPortalRefProvider>
                    </ChakraProvider>
                </TokenListProvider>
            </RainbowKitProvider>
        </WagmiConfig>
        </>

    );
}
