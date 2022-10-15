import { FC, ReactNode } from "react";
import { Box, Container, Flex } from "@chakra-ui/react";
import Image from "next/future/image";

import ConnectWalletButton from "@/components/ConnectWalletButton";

import Logo from "@/public/static/Logo.svg";

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
      <Flex as="header" w="100%" py={5} px={7} justifyContent="space-between" alignItems="center">
        <Image
          alt="Hopscotch Logo"
          src={Logo}
          sizes="100vw"
          style={{ width: 40, maxWidth: "100%", height: "auto" }}
        />
        <ConnectWalletButton />
      </Flex>
      <Container
        as="main"
        mt={3}
        m="0px"
        p="16px"
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
