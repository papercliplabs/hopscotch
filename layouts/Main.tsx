import { FC, ReactNode } from "react";
import { Box, Container, Flex } from "@chakra-ui/react";
import Image from "next/future/image";
import { ConnectButton } from "@papercliplabs/rainbowkit";

import Logo from "@/public/static/Logo.svg";
import Link from "next/link";

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
        <Link href="/" passHref>
          <Box
            as="a"
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
