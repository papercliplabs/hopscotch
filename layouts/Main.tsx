import { Box, Container, Flex } from "@chakra-ui/react"
import ConnectWalletButton from "@/components/ConnectWalletButton";
import { FC, ReactNode } from "react";

export interface AccountMenuProps {
  user: {public_key: string, id: string};
  logout: () => void;
}

export interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = (props) => {
  const {children = Box} = props;
  return (
    <>
      <Flex
        as="header"
        w="100%"
        py={5}
        px={7}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box w={10}/>
        <ConnectWalletButton />

      </Flex>
      <Container as="main" m={0} p={14} mt={3} maxW="100vw" display="flex" justifyContent="center" alignItems="center">
        {children}
      </Container>
      </>
  )
}

