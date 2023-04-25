import { FC, ReactNode } from "react";
import { Box, Button, Container, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";

import Logo from "@/public/static/Logo.svg";
import Link from "next/link";
import { useAccount } from "wagmi";

export interface AccountMenuProps {
    user: { public_key: string; id: string };
    logout: () => void;
}

export interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = (props) => {
    const { children } = props;
    const { address } = useAccount();
    const { openConnectModal } = useConnectModal();

    return (
        <>
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
                {address ? (
                    <ConnectButton />
                ) : (
                    <Button variant="secondary" onClick={openConnectModal}>
                        Connect Wallet
                    </Button>
                )}
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
