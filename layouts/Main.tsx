import { FC, ReactNode } from "react";
import { Box, Container, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { ConnectButton } from "@papercliplabs/rainbowkit";

import Logo from "@/public/static/Logo.svg";
import Link from "next/link";
import Head from 'next/head'

export interface AccountMenuProps {
    user: { public_key: string; id: string };
    logout: () => void;
}

export interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = (props) => {
    const { children } = props;
    return (
        <>
            <Head>
                <title>Hopscotch</title>
                <meta property="og:title" content="MAIN.tsx" />
                <meta property="og:site_name" content="hopscotch.cash/main"/>
                <meta
                    property="og:image"
                    content={`https://${process.env.NEXT_PUBLIC_VERCEL_URL }/api/og?title=MAIN`}
                />
            </Head>
            <Flex as="header" w="100%" py={5} px={7} justifyContent="space-between" alignItems="center">
                <Link href="/" passHref>
                    <Box
                        onClick={() => window.location.reload()}
                        cursor="pointer"
                        transition="transform 0.2s"
                        _hover={{
                            transform: "rotate(15deg)",
                        }}
                    >
                        <Image
                            alt="Hopscotch Logo"
                            src={Logo}
                            sizes="100vw"
                            style={{ width: 40, maxWidth: "100%", height: "auto" }}
                        />
                    </Box>
                </Link>
                <ConnectButton />
            </Flex>
            <Flex
                as="main"
                direction="column"
                mt={4}
                p="16px"
                maxW="100vw"
                justifyContent="center"
                alignItems="space-between"
                boxSizing="border-box"
            >
                {children}
            </Flex>
        </>
    );
};
