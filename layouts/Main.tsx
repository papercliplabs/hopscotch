import { Box, Container, Flex } from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export interface MainLayoutProps {
    children: ReactNode;
    NavElement?: () => ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = (props) => {
    const { children, NavElement = Box } = props;

    return (
        <>
            <Flex as="header" w="100%" py={5} px={7} alignItems="center" justifyContent="space-between">
                <Box w={10} />
                {<NavElement />}
                <ConnectButton />
            </Flex>
            <Container
                as="main"
                m={0}
                p={14}
                mt={3}
                maxW="100vw"
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                {children}
            </Container>
        </>
    );
};
